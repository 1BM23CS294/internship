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
  rewriteResume,
  roastResume,
  confidenceBooster,
  personalBrandCheck,
  hiddenStrengthDiscovery,
  careerRiskAssessment,
  skillObsolescenceWarning,
  resumeVersionControl,
  internshipReadiness,
} from '@/ai/flows';
import type {
  AnalyzedCandidate,
  RewriteResumeOutput,
} from '@/lib/types';
import { z } from 'zod';

const fileSchema = z.instanceof(File).refine(file => file.size > 0, 'A file is required.');

const AnalyzeResumeSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
  resumeFile: fileSchema.refine(file => file.size < 5 * 1024 * 1024, 'Resume file size must be less than 5MB.'),
  country: z.string().min(2, 'Please select a country.'),
  
  // Analysis Mode
  analysisMode: z.enum(['normal', 'fresher', 'executive']).default('normal'),

  // Optional Analyses (Original)
  predictSalary: z.coerce.boolean().default(true),
  analyzeVideo: z.coerce.boolean().default(false),
  videoFile: fileSchema.refine(file => file.size < 50 * 1024 * 1024, 'Video file size must be less than 50MB.').optional(),
  predictWorkLife: z.coerce.boolean().default(true),
  findNetworking: z.coerce.boolean().default(true),
  rewriteResume: z.coerce.boolean().default(true),

  // New Analysis Modules
  roastResume: z.coerce.boolean().default(true),
  confidenceBooster: z.coerce.boolean().default(true),
  personalBrandCheck: z.coerce.boolean().default(true),
  hiddenStrengthDiscovery: z.coerce.boolean().default(true),
  careerRiskAssessment: z.coerce.boolean().default(true),
  skillObsolescenceWarning: z.coerce.boolean().default(true),
  resumeVersionControl: z.coerce.boolean().default(true),
  internshipReadiness: z.coerce.boolean().default(true),
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
  const validatedFields = AnalyzeResumeSchema.safeParse(Object.fromEntries(formData.entries()));

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
    analysisMode,
    // Original optional analyses
    predictSalary,
    analyzeVideo,
    videoFile,
    predictWorkLife,
    findNetworking,
    rewriteResume: shouldRewriteResume,
    // New optional analyses
    roastResume: shouldRoast,
    confidenceBooster: shouldBoost,
    personalBrandCheck: shouldCheckBrand,
    hiddenStrengthDiscovery: shouldDiscoverStrengths,
    careerRiskAssessment: shouldAssessRisk,
    skillObsolescenceWarning: shouldWarnSkills,
    resumeVersionControl: shouldVersion,
    internshipReadiness: shouldAssessInternship,
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
    const rewritePromises = shouldRewriteResume ? [
        rewriteResume({ style: 'ats', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }),
        rewriteResume({ style: 'creative', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }),
        rewriteResume({ style: 'executive', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }),
    ] : [Promise.resolve(null), Promise.resolve(null), Promise.resolve(null)];

    const analysisPromises = [
        // Core analyses
        generateResumeMatchScore({ resumeSkills: extractedInfo.skills, resumeExperience: resumeExperienceSummary, jobDescription }),
        generateHiringRecommendations({ parsedResume: {
            name: extractedInfo.name,
            email: extractedInfo.email,
            skills: extractedInfo.skills,
            experience: extractedInfo.experience,
            education: extractedInfo.education,
            summary: extractedInfo.summary,
        }, jobDescription, overallScore: 0 }),
        generateCareerPersonalityProfile({ resumeSummary: resumeFullTextForProfiling }),
        
        // Original optional analyses
        predictSalary ? predictSalaryRange({ jobDescription, resumeSkills: extractedInfo.skills, resumeExperience: resumeExperienceSummary, country }) : Promise.resolve(null),
        (analyzeVideo && videoFile) ? analyzeVideoResume({ videoDataUri: await fileToDataUri(videoFile) }) : Promise.resolve(null),
        predictWorkLife ? predictWorkLifeBalance({ jobDescription, resumeExperience: resumeExperienceSummary }) : Promise.resolve(null),
        findNetworking ? findNetworkingOpportunities({ jobTitle: extractedInfo.experience[0]?.title || 'Professional', skills: extractedInfo.skills, location: country }) : Promise.resolve(null),
        ...rewritePromises,
        
        // New optional analyses
        shouldRoast ? roastResume({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        shouldBoost ? confidenceBooster({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        shouldCheckBrand ? personalBrandCheck({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        shouldDiscoverStrengths ? hiddenStrengthDiscovery({ resumeExperience: resumeExperienceSummary, resumeSkills: extractedInfo.skills }) : Promise.resolve(null),
        shouldAssessRisk ? careerRiskAssessment({ jobTitle: extractedInfo.experience[0]?.title || 'Unknown', industry: 'General', skills: extractedInfo.skills }) : Promise.resolve(null),
        shouldWarnSkills ? skillObsolescenceWarning({ skills: extractedInfo.skills }) : Promise.resolve(null),
        shouldVersion ? resumeVersionControl({ resumeSummary: extractedInfo.summary || '', jobDescription }) : Promise.resolve(null),
        (shouldAssessInternship || analysisMode === 'fresher') ? internshipReadiness({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
    ];

    const [
        // Core
        analysis, recommendations, personalityProfile,
        // Original
        salaryPrediction, videoAnalysis, workLifeBalance, networking, atsRewrite, creativeRewrite, executiveRewrite,
        // New
        roast, confidenceReport, brandCheck, hiddenStrengths, riskAssessment, skillWarning, versionSuggestion, internshipReport,
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
      // Optional analysis results
      salaryPrediction: salaryPrediction || undefined,
      videoAnalysis: videoAnalysis || undefined,
      workLifeBalance: workLifeBalance || undefined,
      networking: networking || undefined,
      resumeRewrite: (atsRewrite && creativeRewrite && executiveRewrite) ? {
        ats: atsRewrite as RewriteResumeOutput,
        creative: creativeRewrite as RewriteResumeOutput,
        executive: executiveRewrite as RewriteResumeOutput,
      } : undefined,
      // New analysis results
      roast: roast || undefined,
      confidenceReport: confidenceReport || undefined,
      brandCheck: brandCheck || undefined,
      hiddenStrengths: hiddenStrengths || undefined,
      riskAssessment: riskAssessment || undefined,
      skillWarning: skillWarning || undefined,
      versionSuggestion: versionSuggestion || undefined,
      internshipReport: internshipReport || undefined,
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
