'use server';

import {
  extractResumeInformation,
  generateHiringRecommendations,
  generateResumeMatchScore,
  predictSalaryRange,
  generateCareerPersonalityProfile,
} from '@/ai/flows';
import type { AnalyzedCandidate, SalaryPredictionResult } from '@/lib/types';
import { z } from 'zod';

const AnalyzeResumeSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
  resumeFile: z.instanceof(File).refine(file => file.size > 0, 'A resume file is required.').refine(file => file.size < 5 * 1024 * 1024, 'File size must be less than 5MB.'),
  predictSalary: z.coerce.boolean().default(true),
  country: z.string().min(2, 'Please select a country.'),
});

type FormState = {
  success: boolean;
  message: string;
  data?: AnalyzedCandidate;
  errors?: {
    jobDescription?: string[];
    resumeFile?: string[];
    country?: string[];
    _form?: string[];
  };
};

export async function analyzeResume(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = AnalyzeResumeSchema.safeParse({
    jobDescription: formData.get('jobDescription'),
    resumeFile: formData.get('resumeFile'),
    predictSalary: formData.get('predictSalary'),
    country: formData.get('country'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { jobDescription, resumeFile, predictSalary, country } = validatedFields.data;

  try {
    // 1. Convert file to data URI
    const fileBuffer = await resumeFile.arrayBuffer();
    const dataUri = `data:${resumeFile.type};base64,${Buffer.from(fileBuffer).toString('base64')}`;

    // 2. Extract resume information
    const extractedInfo = await extractResumeInformation({ resumeDataUri: dataUri });

    if (!extractedInfo || !extractedInfo.name) {
       throw new Error('Could not parse resume. Please ensure the file is a valid resume (PDF, DOCX) and is not corrupted.');
    }
    
    const resumeExperienceSummary = extractedInfo.summary || extractedInfo.experience.map(exp => `${exp.title} at ${exp.company}: ${exp.description}`).join('\n');
    const resumeFullTextForProfiling = `${extractedInfo.summary || ''}\n\nSkills: ${extractedInfo.skills.join(', ')}\n\nExperience:\n${resumeExperienceSummary}`;


    // 3. Generate match score and detailed analysis
    const analysis = await generateResumeMatchScore({
      resumeSkills: extractedInfo.skills,
      resumeExperience: resumeExperienceSummary,
      jobDescription,
    });

    // 4. Generate hiring recommendations
    const recommendations = await generateHiringRecommendations({
      parsedResume: {
        name: extractedInfo.name,
        email: extractedInfo.email,
        skills: extractedInfo.skills,
        experience: extractedInfo.experience.map(e => ({
          title: e.title,
          company: e.company,
          startDate: e.startDate,
          endDate: e.endDate,
          description: e.description,
        })),
        education: extractedInfo.education.map(e => ({
          degree: e.degree,
          institution: e.institution,
          year: e.year,
        })),
        summary: extractedInfo.summary,
      },
      jobDescription,
      overallScore: analysis.overallScore,
    });
    
    // 5. Predict Salary (conditionally)
    let salaryPrediction: SalaryPredictionResult;
    if (predictSalary) {
        salaryPrediction = await predictSalaryRange({
            jobDescription,
            resumeSkills: extractedInfo.skills,
            resumeExperience: resumeExperienceSummary,
            country,
        });
    } else {
        salaryPrediction = {
            predictedMinSalary: 0,
            predictedMaxSalary: 0,
            currency: 'USD',
            confidenceScore: 0,
            explanation: 'Salary prediction was not requested.',
            optimizationTips: [],
        };
    }

    // 6. Generate Career Personality Profile
    const personalityProfile = await generateCareerPersonalityProfile({ resumeSummary: resumeFullTextForProfiling });


    const result: AnalyzedCandidate = {
      id: crypto.randomUUID(),
      fileName: resumeFile.name,
      candidate: extractedInfo,
      analysis,
      recommendations,
      salaryPrediction,
      personalityProfile,
    };

    return { success: true, message: 'Analysis complete.', data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during analysis.';
    return {
      success: false,
      message: 'Analysis failed.',
      errors: { _form: [errorMessage] }
    };
  }
}
