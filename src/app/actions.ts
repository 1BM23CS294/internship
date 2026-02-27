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
} from '@/lib/types';
import { z } from 'zod';

const fileSchema = z.instanceof(File).refine(file => file.size > 0, 'A file is required.');

const AnalyzeResumeSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
  resumeFiles: z.array(fileSchema.refine(file => file.size < 5 * 1024 * 1024, 'Each resume file size must be less than 5MB.')).min(1, 'At least one resume is required.'),
  country: z.string().min(2, 'Please select a country.'),
  
  // Analysis Mode
  analysisMode: z.enum(['normal', 'fresher', 'executive']).default('normal'),

  // Optional Analyses
  predictSalary: z.coerce.boolean().default(true),
  analyzeVideo: z.coerce.boolean().default(false),
  videoFile: fileSchema.refine(file => file.size < 50 * 1024 * 1024, 'Video file size must be less than 50MB.').optional(),
  predictWorkLife: z.coerce.boolean().default(true),
  findNetworking: z.coerce.boolean().default(true),
  rewriteResume: z.coerce.boolean().default(true),
  roastResume: z.coerce.boolean().default(true),
  confidenceBooster: z.coerce.boolean().default(true),
  personalBrandCheck: z.coerce.boolean().default(true),
  hiddenStrengthDiscovery: z.coerce.boolean().default(true),
  careerRiskAssessment: z.coerce.boolean().default(true),
  skillObsolescenceWarning: z.coerce.boolean().default(true),
  resumeVersionControl: z.coerce.boolean().default(true),
  internshipReadiness: z.coerce.boolean().default(true),
  candidateRanking: z.coerce.boolean().default(true),
  teamBenchmarking: z.coerce.boolean().default(true),
  hiringFunnelInsights: z.coerce.boolean().default(true),
  countrySpecificRules: z.coerce.boolean().default(true),
  visaReadiness: z.coerce.boolean().default(true),
  exportFormats: z.coerce.boolean().default(true),
}).superRefine((data, ctx) => {
  if (data.analyzeVideo && !data.videoFile) {
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
        predictSalary,
        analyzeVideo,
        videoFile,
        predictWorkLife,
        findNetworking,
        rewriteResume: shouldRewriteResume,
        roastResume: shouldRoastResume,
        confidenceBooster: shouldBoostConfidence,
        personalBrandCheck: shouldCheckPersonalBrand,
        hiddenStrengthDiscovery: shouldDiscoverHiddenStrengths,
        careerRiskAssessment: shouldAssessCareerRisk,
        skillObsolescenceWarning: shouldWarnSkillObsolescence,
        resumeVersionControl: shouldControlResumeVersion,
        internshipReadiness: shouldAssessInternshipReadiness,
        candidateRanking,
        teamBenchmarking,
        hiringFunnelInsights,
        countrySpecificRules,
        visaReadiness,
        exportFormats,
    } = options;

    const fileToDataUri = async (file: File) => {
        const fileBuffer = await file.arrayBuffer();
        return `data:${file.type};base64,${Buffer.from(fileBuffer).toString('base64')}`;
    };

    // 1. Core Extraction (THE ONLY LIVE AI CALL)
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
    const parsedResumeForHiringRecs = {
        name: extractedInfo.name,
        email: extractedInfo.email,
        skills: extractedInfo.skills,
        experience: extractedInfo.experience.map(e => ({ ...e, description: e.description || '' })),
        education: extractedInfo.education,
        summary: extractedInfo.summary,
    };

    // 2. Run all other modules as fast, dynamic placeholders IN PARALLEL
    // These are now reliable because they don't make external live AI calls.
    const [
        analysis, 
        recommendations, 
        personalityProfile,
        salaryPredictionResult,
        videoAnalysisResult,
        workLifeBalanceResult,
        networkingResult,
        atsRewriteResult,
        creativeRewriteResult,
        executiveRewriteResult,
        roastResult,
        confidenceReportResult,
        brandCheckResult,
        hiddenStrengthsResult,
        riskAssessmentResult,
        skillWarningResult,
        versionSuggestionResult,
        internshipReportResult,
        rankingResult,
        benchmarkResult,
        funnelInsightsResult,
        resumeExportsResult,
        countryRulesResult,
        visaSponsorshipResult,
    ] = await Promise.all([
        generateResumeMatchScore({ resumeSkills: extractedInfo.skills, resumeExperience: resumeExperienceSummary, jobDescription }),
        generateHiringRecommendations({ parsedResume: parsedResumeForHiringRecs, jobDescription }),
        generateCareerPersonalityProfile({ resumeSummary: resumeFullTextForProfiling }),
        predictSalary ? predictSalaryRange({ jobDescription, resumeSkills: extractedInfo.skills, resumeExperience: resumeExperienceSummary, country }) : Promise.resolve(null),
        (analyzeVideo && videoFile) ? fileToDataUri(videoFile).then(uri => analyzeVideoResume({ videoDataUri: uri })) : Promise.resolve(null),
        predictWorkLife ? predictWorkLifeBalance({ jobDescription, resumeExperience: resumeExperienceSummary }) : Promise.resolve(null),
        findNetworking ? findNetworkingOpportunities({ jobTitle: extractedInfo.experience[0]?.title || 'Professional', skills: extractedInfo.skills, location: country }) : Promise.resolve(null),
        shouldRewriteResume ? rewriteResume({ style: 'ats', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }) : Promise.resolve(null),
        shouldRewriteResume ? rewriteResume({ style: 'creative', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }) : Promise.resolve(null),
        shouldRewriteResume ? rewriteResume({ style: 'executive', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }) : Promise.resolve(null),
        shouldRoastResume ? roastResume({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        shouldBoostConfidence ? confidenceBooster({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        shouldCheckPersonalBrand ? personalBrandCheck({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        shouldDiscoverHiddenStrengths ? hiddenStrengthDiscovery({ resumeExperience: resumeExperienceSummary, resumeSkills: extractedInfo.skills }) : Promise.resolve(null),
        shouldAssessCareerRisk ? careerRiskAssessment({ jobTitle: extractedInfo.experience[0]?.title || 'Unknown', industry: 'General', skills: extractedInfo.skills }) : Promise.resolve(null),
        shouldWarnSkillObsolescence ? skillObsolescenceWarning({ skills: extractedInfo.skills }) : Promise.resolve(null),
        shouldControlResumeVersion ? resumeVersionControl({ resumeSummary: extractedInfo.summary || '', jobDescription }) : Promise.resolve(null),
        (shouldAssessInternshipReadiness || analysisMode === 'fresher') ? internshipReadiness({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        candidateRanking ? rankCandidate({ jobDescription }) : Promise.resolve(null),
        teamBenchmarking ? benchmarkCandidate({ skills: extractedInfo.skills }) : Promise.resolve(null),
        hiringFunnelInsights ? getHiringFunnelInsights({ jobDescription }) : Promise.resolve(null),
        exportFormats ? getResumeExports({ resumeData: JSON.stringify(extractedInfo) }) : Promise.resolve(null),
        countrySpecificRules ? getCountryResumeRules({ country }) : Promise.resolve(null),
        visaReadiness ? assessVisaSponsorship({ country, jobTitle: extractedInfo.experience[0]?.title || 'Engineer', skills: extractedInfo.skills }) : Promise.resolve(null),
    ]);


    // 3. Assemble Final Result
    const result: AnalyzedCandidate = {
        id: crypto.randomUUID(),
        fileName: resumeFile.name,
        candidate: extractedInfo,
        analysis,
        recommendations,
        personalityProfile,
        salaryPrediction: salaryPredictionResult || undefined,
        videoAnalysis: videoAnalysisResult || undefined,
        workLifeBalance: workLifeBalanceResult || undefined,
        networking: networkingResult || undefined,
        resumeRewrite: (atsRewriteResult && creativeRewriteResult && executiveRewriteResult) ? { ats: atsRewriteResult, creative: creativeRewriteResult, executive: executiveRewriteResult } : undefined,
        roast: roastResult || undefined,
        confidenceReport: confidenceReportResult || undefined,
        brandCheck: brandCheckResult || undefined,
        hiddenStrengths: hiddenStrengthsResult || undefined,
        riskAssessment: riskAssessmentResult || undefined,
        skillWarning: skillWarningResult || undefined,
        versionSuggestion: versionSuggestionResult || undefined,
        internshipReport: internshipReportResult || undefined,
        ranking: rankingResult || undefined,
        benchmark: benchmarkResult || undefined,
        funnelInsights: funnelInsightsResult || undefined,
        resumeExports: resumeExportsResult || undefined,
        countryRules: countryRulesResult || undefined,
        visaSponsorship: visaSponsorshipResult || undefined,
    };
    return result;
}


export async function analyzeResume(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const allEntries = Object.fromEntries(formData.entries());
  
   const dataToValidate: Record<string, any> = {
      jobDescription: allEntries.jobDescription,
      resumeFiles: formData.getAll('resumeFile').filter(f => f instanceof File && f.size > 0),
      country: allEntries.country,
      analysisMode: allEntries.analysisMode,
      predictSalary: allEntries.predictSalary,
      analyzeVideo: allEntries.analyzeVideo,
      predictWorkLife: allEntries.predictWorkLife,
      findNetworking: allEntries.findNetworking,
      rewriteResume: allEntries.rewriteResume,
      roastResume: allEntries.roastResume,
      confidenceBooster: allEntries.confidenceBooster,
      personalBrandCheck: allEntries.personalBrandCheck,
      hiddenStrengthDiscovery: allEntries.hiddenStrengthDiscovery,
      careerRiskAssessment: allEntries.careerRiskAssessment,
      skillObsolescenceWarning: allEntries.skillObsolescenceWarning,
      resumeVersionControl: allEntries.resumeVersionControl,
      internshipReadiness: allEntries.internshipReadiness,
      candidateRanking: allEntries.candidateRanking,
      teamBenchmarking: allEntries.teamBenchmarking,
      hiringFunnelInsights: allEntries.hiringFunnelInsights,
      countrySpecificRules: allEntries.countrySpecificRules,
      visaReadiness: allEntries.visaReadiness,
      exportFormats: allEntries.exportFormats,
  };

  const videoFile = formData.get('videoFile');
  if (videoFile instanceof File && videoFile.size > 0) {
    dataToValidate.videoFile = videoFile;
  }
  
  const validatedFields = AnalyzeResumeSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Validation failed. Please check the form for errors.",
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
