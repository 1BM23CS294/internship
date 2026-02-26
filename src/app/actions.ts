'use server';

import {
  extractResumeInformation,
  generateHiringRecommendations,
  generateResumeMatchScore,
  predictSalaryRange,
  generateCareerPersonalityProfile,
  analyzeVideoResume,
  predictWorkLifeBalance,
  findNetworkingOpportunities,
} from '@/ai/flows';
import type {
  AnalyzedCandidate,
  SalaryPredictionResult,
  VideoAnalysisOutput,
  WorkLifeBalanceOutput,
  NetworkingOpportunitiesOutput,
} from '@/lib/types';
import { z } from 'zod';

const fileSchema = z.instanceof(File).refine(file => file.size > 0, 'A file is required.');

const AnalyzeResumeSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
  resumeFile: fileSchema.refine(file => file.size < 5 * 1024 * 1024, 'Resume file size must be less than 5MB.'),
  country: z.string().min(2, 'Please select a country.'),
  
  // Optional Analyses
  predictSalary: z.coerce.boolean().default(false),
  analyzeVideo: z.coerce.boolean().default(false),
  videoFile: fileSchema.refine(file => file.size < 50 * 1024 * 1024, 'Video file size must be less than 50MB.').optional(),
  predictWorkLife: z.coerce.boolean().default(false),
  findNetworking: z.coerce.boolean().default(false),
});


type FormState = {
  success: boolean;
  message: string;
  data?: AnalyzedCandidate;
  errors?: {
    jobDescription?: string[];
    resumeFile?: string[];
    country?: string[];
    videoFile?: string[];
    _form?: string[];
  };
};

export async function analyzeResume(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = AnalyzeResumeSchema.safeParse({
    jobDescription: formData.get('jobDescription'),
    resumeFile: formData.get('resumeFile'),
    country: formData.get('country'),
    predictSalary: formData.get('predictSalary'),
    analyzeVideo: formData.get('analyzeVideo'),
    videoFile: formData.get('videoFile'),
    predictWorkLife: formData.get('predictWorkLife'),
    findNetworking: formData.get('findNetworking'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { 
    jobDescription, 
    resumeFile, 
    country,
    predictSalary,
    analyzeVideo,
    videoFile,
    predictWorkLife,
    findNetworking
  } = validatedFields.data;

  try {
    const fileToDataUri = async (file: File) => {
        const fileBuffer = await file.arrayBuffer();
        return `data:${file.type};base64,${Buffer.from(fileBuffer).toString('base64')}`;
    }

    // 1. Convert resume to data URI and start core analysis
    const resumeDataUri = await fileToDataUri(resumeFile);
    const extractedInfo = await extractResumeInformation({ resumeDataUri });

    if (!extractedInfo || !extractedInfo.name) {
       throw new Error('Could not parse resume. Please ensure the file is a valid resume (PDF, DOCX) and is not corrupted.');
    }
    
    const resumeExperienceSummary = extractedInfo.summary || extractedInfo.experience.map(exp => `${exp.title} at ${exp.company}: ${exp.description}`).join('\n');
    const resumeFullTextForProfiling = `${extractedInfo.summary || ''}\n\nSkills: ${extractedInfo.skills.join(', ')}\n\nExperience:\n${resumeExperienceSummary}`;

    // 2. Perform all selected analyses in parallel
    const analysisPromises = [
        generateResumeMatchScore({
            resumeSkills: extractedInfo.skills,
            resumeExperience: resumeExperienceSummary,
            jobDescription,
        }),
        generateHiringRecommendations({
            parsedResume: {
                name: extractedInfo.name, email: extractedInfo.email, skills: extractedInfo.skills,
                experience: extractedInfo.experience.map(e => ({ title: e.title, company: e.company, startDate: e.startDate, endDate: e.endDate, description: e.description })),
                education: extractedInfo.education.map(e => ({ degree: e.degree, institution: e.institution, year: e.year })),
                summary: extractedInfo.summary,
            },
            jobDescription,
            overallScore: 0, // This will be updated later
        }),
        generateCareerPersonalityProfile({ resumeSummary: resumeFullTextForProfiling }),
        predictSalary ? predictSalaryRange({ jobDescription, resumeSkills: extractedInfo.skills, resumeExperience: resumeExperienceSummary, country }) : Promise.resolve(null),
        (analyzeVideo && videoFile) ? analyzeVideoResume({ videoDataUri: await fileToDataUri(videoFile) }) : Promise.resolve(null),
        predictWorkLife ? predictWorkLifeBalance({ jobDescription, resumeExperience: resumeExperienceSummary }) : Promise.resolve(null),
        findNetworking ? findNetworkingOpportunities({ jobTitle: extractedInfo.experience[0]?.title || 'Professional', skills: extractedInfo.skills, location: country }) : Promise.resolve(null)
    ];

    const [
        analysis,
        recommendations,
        personalityProfile,
        salaryPrediction,
        videoAnalysis,
        workLifeBalance,
        networking,
    ] = await Promise.all(analysisPromises);
    
    // Post-update recommendations with the actual score
    recommendations.overallRecommendation = `Based on an overall match score of ${analysis.overallScore}%, ${recommendations.overallRecommendation}`;


    const result: AnalyzedCandidate = {
      id: crypto.randomUUID(),
      fileName: resumeFile.name,
      candidate: extractedInfo,
      analysis,
      recommendations,
      personalityProfile,
      salaryPrediction: salaryPrediction || undefined,
      videoAnalysis: videoAnalysis || undefined,
      workLifeBalance: workLifeBalance || undefined,
      networking: networking || undefined,
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
