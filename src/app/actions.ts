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
  rankCandidate,
  benchmarkCandidate,
  getHiringFunnelInsights,
  getResumeExports,
  getCountryResumeRules,
  assessVisaSponsorship,
} from '@/ai/flows';
import type {
  AnalyzedCandidate,
  RewriteResumeOutput,
  VideoAnalysisOutput,
} from '@/lib/types';
import { z } from 'zod';

const fileSchema = z.instanceof(File).refine(file => file.size > 0, 'A file is required.');

const AnalyzeResumeSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
  resumeFiles: z.array(fileSchema.refine(file => file.size < 5 * 1024 * 1024, 'Each resume file size must be less than 5MB.')).min(1, 'At least one resume is required.'),
  country: z.string().min(2, 'Please select a country.'),
  
  // Analysis Mode
  analysisMode: z.enum(['normal', 'fresher', 'executive']).default('normal'),

  // Optional Analyses (Original)
  shouldPredictSalary: z.coerce.boolean().default(true),
  shouldAnalyzeVideo: z.coerce.boolean().default(false),
  videoFile: fileSchema.refine(file => file.size < 50 * 1024 * 1024, 'Video file size must be less than 50MB.').optional(),
  shouldPredictWorkLife: z.coerce.boolean().default(true),
  shouldFindNetworking: z.coerce.boolean().default(true),
  shouldRewriteResume: z.coerce.boolean().default(true),

  // New Analysis Modules
  shouldRoastResume: z.coerce.boolean().default(true),
  shouldBoostConfidence: z.coerce.boolean().default(true),
  shouldCheckPersonalBrand: z.coerce.boolean().default(true),
  shouldDiscoverHiddenStrengths: z.coerce.boolean().default(true),
  shouldAssessCareerRisk: z.coerce.boolean().default(true),
  shouldWarnSkillObsolescence: z.coerce.boolean().default(true),
  shouldControlResumeVersion: z.coerce.boolean().default(true),
  shouldAssessInternshipReadiness: z.coerce.boolean().default(true),

  // Enterprise Modules
  shouldRankCandidate: z.coerce.boolean().default(true),
  shouldBenchmarkTeam: z.coerce.boolean().default(true),
  shouldGetHiringFunnelInsights: z.coerce.boolean().default(true),

  // International
  shouldGetResumeExports: z.coerce.boolean().default(true),
  shouldGetCountryRules: z.coerce.boolean().default(true),
  shouldAssessVisa: z.coerce.boolean().default(true),
}).superRefine((data, ctx) => {
  if (data.shouldAnalyzeVideo && !data.videoFile) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["videoFile"],
      message: "A video file must be uploaded when Video Analysis is enabled.",
    });
  }
});


type FormState = {
  success: boolean;
  message: string;
  data?: AnalyzedCandidate[];
  errors?: {
    jobDescription?: string[];
    resumeFiles?: string[];
    country?: string[];
    videoFile?: string[];
    _form?: string[];
  };
};

async function _analyzeSingleResume(
    resumeFile: File,
    jobDescription: string,
    country: string,
    options: Omit<z.infer<typeof AnalyzeResumeSchema>, 'resumeFiles' | 'jobDescription' | 'country'>
): Promise<AnalyzedCandidate> {
    const {
        analysisMode,
        shouldPredictSalary,
        shouldAnalyzeVideo,
        videoFile,
        shouldPredictWorkLife,
        shouldFindNetworking,
        shouldRewriteResume,
        shouldRoastResume,
        shouldBoostConfidence,
        shouldCheckPersonalBrand,
        shouldDiscoverHiddenStrengths,
        shouldAssessCareerRisk,
        shouldWarnSkillObsolescence,
        shouldControlResumeVersion,
        shouldAssessInternshipReadiness,
        shouldRankCandidate,
        shouldBenchmarkTeam,
        shouldGetHiringFunnelInsights,
        shouldGetResumeExports,
        shouldGetCountryRules,
        shouldAssessVisa,
    } = options;

    const fileToDataUri = async (file: File) => {
        const fileBuffer = await file.arrayBuffer();
        return `data:${file.type};base64,${Buffer.from(fileBuffer).toString('base64')}`;
    };

    // 1. Core Extraction (Critical Path)
    let extractedInfo;
    try {
        const resumeDataUri = await fileToDataUri(resumeFile);
        extractedInfo = await extractResumeInformation({ resumeDataUri });
    } catch (e) {
        console.error("Error during extractResumeInformation:", e);
        throw new Error(`The AI failed to read the resume '${resumeFile.name}'. The file may be corrupted or in an unsupported format.`);
    }

    if (!extractedInfo || !extractedInfo.name) {
        throw new Error(`Could not parse resume '${resumeFile.name}'. Please ensure the file is a valid and clearly structured resume.`);
    }

    const resumeExperienceSummary = extractedInfo.summary || extractedInfo.experience.map(exp => `${exp.title} at ${exp.company}: ${exp.description}`).join('\n');
    const resumeFullTextForProfiling = `${extractedInfo.summary || ''}\n\nSkills: ${extractedInfo.skills.join(', ')}\n\nExperience:\n${resumeExperienceSummary}`;

    // 2. Core Analysis (Critical Path)
    // These must succeed for a meaningful report.
    const [analysis, recommendations, personalityProfile] = await Promise.all([
        generateResumeMatchScore({ resumeSkills: extractedInfo.skills, resumeExperience: resumeExperienceSummary, jobDescription }),
        generateHiringRecommendations({
            parsedResume: {
                name: extractedInfo.name,
                email: extractedInfo.email,
                skills: extractedInfo.skills,
                experience: extractedInfo.experience.map(e => ({ ...e, description: e.description || '' })),
                education: extractedInfo.education,
                summary: extractedInfo.summary,
            },
            jobDescription,
        }),
        generateCareerPersonalityProfile({ resumeSummary: resumeFullTextForProfiling }),
    ]);

    if (!analysis || !recommendations || !personalityProfile) {
        throw new Error("Core AI analysis modules failed to generate a result.");
    }
    
    // 3. Optional Modules (Non-Critical Path)
    // These run in parallel and won't fail the entire analysis if one errors out.
    const optionalModulePromises = {
        salaryPrediction: shouldPredictSalary ? predictSalaryRange({ jobDescription, resumeSkills: extractedInfo.skills, resumeExperience: resumeExperienceSummary, country }) : Promise.resolve(null),
        videoAnalysis: (shouldAnalyzeVideo && videoFile) ? fileToDataUri(videoFile).then(uri => analyzeVideoResume({ videoDataUri: uri })) : Promise.resolve(null),
        workLifeBalance: shouldPredictWorkLife ? predictWorkLifeBalance({ jobDescription, resumeExperience: resumeExperienceSummary }) : Promise.resolve(null),
        networking: shouldFindNetworking ? findNetworkingOpportunities({ jobTitle: extractedInfo.experience[0]?.title || 'Professional', skills: extractedInfo.skills, location: country }) : Promise.resolve(null),
        atsRewrite: shouldRewriteResume ? rewriteResume({ style: 'ats', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }) : Promise.resolve(null),
        creativeRewrite: shouldRewriteResume ? rewriteResume({ style: 'creative', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }) : Promise.resolve(null),
        executiveRewrite: shouldRewriteResume ? rewriteResume({ style: 'executive', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }) : Promise.resolve(null),
        roast: shouldRoastResume ? roastResume({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        confidenceReport: shouldBoostConfidence ? confidenceBooster({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        brandCheck: shouldCheckPersonalBrand ? personalBrandCheck({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        hiddenStrengths: shouldDiscoverHiddenStrengths ? hiddenStrengthDiscovery({ resumeExperience: resumeExperienceSummary, resumeSkills: extractedInfo.skills }) : Promise.resolve(null),
        riskAssessment: shouldAssessCareerRisk ? careerRiskAssessment({ jobTitle: extractedInfo.experience[0]?.title || 'Unknown', industry: 'General', skills: extractedInfo.skills }) : Promise.resolve(null),
        skillWarning: shouldWarnSkillObsolescence ? skillObsolescenceWarning({ skills: extractedInfo.skills }) : Promise.resolve(null),
        versionSuggestion: shouldControlResumeVersion ? resumeVersionControl({ resumeSummary: extractedInfo.summary || '', jobDescription }) : Promise.resolve(null),
        internshipReport: (shouldAssessInternshipReadiness || analysisMode === 'fresher') ? internshipReadiness({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        ranking: shouldRankCandidate ? rankCandidate({ jobDescription }) : Promise.resolve(null),
        benchmark: shouldBenchmarkTeam ? benchmarkCandidate({ skills: extractedInfo.skills }) : Promise.resolve(null),
        funnelInsights: shouldGetHiringFunnelInsights ? getHiringFunnelInsights({ jobDescription }) : Promise.resolve(null),
        resumeExports: shouldGetResumeExports ? getResumeExports({ resumeData: JSON.stringify(extractedInfo) }) : Promise.resolve(null),
        countryRules: shouldGetCountryRules ? getCountryResumeRules({ country }) : Promise.resolve(null),
        visaSponsorship: shouldAssessVisa ? assessVisaSponsorship({ country, jobTitle: extractedInfo.experience[0]?.title || 'Engineer', skills: extractedInfo.skills }) : Promise.resolve(null),
    };

    const settledResults = await Promise.allSettled(Object.values(optionalModulePromises));
    
    const optionalResults = Object.keys(optionalModulePromises).reduce((acc, key, index) => {
        const result = settledResults[index];
        if (result.status === 'fulfilled') {
            acc[key as keyof typeof optionalModulePromises] = result.value;
        } else {
            console.error(`Optional analysis module '${key}' failed:`, result.reason);
            acc[key as keyof typeof optionalModulePromises] = null; // Assign null if promise rejected
        }
        return acc;
    }, {} as { [K in keyof typeof optionalModulePromises]: any });
    
    // 4. Assemble Final Result
    const result: AnalyzedCandidate = {
        id: crypto.randomUUID(),
        fileName: resumeFile.name,
        candidate: extractedInfo,
        analysis,
        recommendations,
        personalityProfile,
        salaryPrediction: optionalResults.salaryPrediction || undefined,
        videoAnalysis: optionalResults.videoAnalysis || undefined,
        workLifeBalance: optionalResults.workLifeBalance || undefined,
        networking: optionalResults.networking || undefined,
        resumeRewrite: (optionalResults.atsRewrite && optionalResults.creativeRewrite && optionalResults.executiveRewrite) ? { ats: optionalResults.atsRewrite, creative: optionalResults.creativeRewrite, executive: optionalResults.executiveRewrite } : undefined,
        roast: optionalResults.roast || undefined,
        confidenceReport: optionalResults.confidenceReport || undefined,
        brandCheck: optionalResults.brandCheck || undefined,
        hiddenStrengths: optionalResults.hiddenStrengths || undefined,
        riskAssessment: optionalResults.riskAssessment || undefined,
        skillWarning: optionalResults.skillWarning || undefined,
        versionSuggestion: optionalResults.versionSuggestion || undefined,
        internshipReport: optionalResults.internshipReport || undefined,
        ranking: optionalResults.ranking || undefined,
        benchmark: optionalResults.benchmark || undefined,
        funnelInsights: optionalResults.funnelInsights || undefined,
        resumeExports: optionalResults.resumeExports || undefined,
        countryRules: optionalResults.countryRules || undefined,
        visaSponsorship: optionalResults.visaSponsorship || undefined,
    };
    return result;
}


export async function analyzeResume(prevState: FormState, formData: FormData): Promise<FormState> {
  const allEntries = Object.fromEntries(formData.entries());
  
   const dataToValidate: Record<string, any> = {
      jobDescription: allEntries.jobDescription,
      resumeFiles: formData.getAll('resumeFile').filter(f => f instanceof File && f.size > 0),
      country: allEntries.country,
      analysisMode: allEntries.analysisMode,
      shouldPredictSalary: allEntries.predictSalary,
      shouldAnalyzeVideo: allEntries.analyzeVideo,
      shouldPredictWorkLife: allEntries.predictWorkLife,
      shouldFindNetworking: allEntries.findNetworking,
      shouldRewriteResume: allEntries.rewriteResume,
      shouldRoastResume: allEntries.roastResume,
      shouldBoostConfidence: allEntries.confidenceBooster,
      shouldCheckPersonalBrand: allEntries.personalBrandCheck,
      shouldDiscoverHiddenStrengths: allEntries.hiddenStrengthDiscovery,
      shouldAssessCareerRisk: allEntries.careerRiskAssessment,
      shouldWarnSkillObsolescence: allEntries.skillObsolescenceWarning,
      shouldControlResumeVersion: allEntries.resumeVersionControl,
      shouldAssessInternshipReadiness: allEntries.internshipReadiness,
      shouldRankCandidate: allEntries.candidateRanking,
      shouldBenchmarkTeam: allEntries.teamBenchmarking,
      shouldGetHiringFunnelInsights: allEntries.hiringFunnelInsights,
      shouldGetResumeExports: allEntries.getResumeExports,
      shouldGetCountryRules: allEntries.getCountryRules,
      shouldAssessVisa: allEntries.assessVisa,
  };

  // Zod's `optional` doesn't handle empty File objects from forms well.
  // Pre-process to remove videoFile if it's not a valid, uploaded file.
  const videoFile = formData.get('videoFile');
  if (videoFile instanceof File && videoFile.size > 0) {
    dataToValidate.videoFile = videoFile;
  }
  
  const validatedFields = AnalyzeResumeSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { resumeFiles, jobDescription, country, ...options } = validatedFields.data;

  try {
    const analysisPromises = resumeFiles.map(resumeFile => 
      _analyzeSingleResume(resumeFile, jobDescription, country, options)
    );
    const results = await Promise.all(analysisPromises);
    
    return { success: true, message: `${results.length} resumes analyzed successfully.`, data: results };

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
