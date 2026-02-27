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

  // Enterprise Modules
  candidateRanking: z.coerce.boolean().default(false),
  teamBenchmarking: z.coerce.boolean().default(false),
  hiringFunnelInsights: z.coerce.boolean().default(false),

  // International
  getResumeExports: z.coerce.boolean().default(false),
  getCountryRules: z.coerce.boolean().default(false),
  assessVisa: z.coerce.boolean().default(false),
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
        roastResume: shouldRoast,
        confidenceBooster: shouldBoost,
        personalBrandCheck: shouldCheckBrand,
        hiddenStrengthDiscovery: shouldDiscoverStrengths,
        careerRiskAssessment: shouldAssessRisk,
        skillObsolescenceWarning: shouldWarnSkills,
        resumeVersionControl: shouldVersion,
        internshipReadiness: shouldAssessInternship,
        candidateRanking,
        teamBenchmarking,
        hiringFunnelInsights,
        // International
        getResumeExports,
        getCountryRules,
        assessVisa,
    } = options;

    const fileToDataUri = async (file: File) => {
        const fileBuffer = await file.arrayBuffer();
        return `data:${file.type};base64,${Buffer.from(fileBuffer).toString('base64')}`;
    }

    // 1. Convert resume to data URI
    const resumeDataUri = await fileToDataUri(resumeFile);

    // 2. Start core analysis, with specific error handling for parsing
    let extractedInfo;
    try {
        extractedInfo = await extractResumeInformation({ resumeDataUri });
    } catch (e) {
        console.error("Error during extractResumeInformation:", e);
        // This is a critical failure point. Provide a detailed error message.
        throw new Error(`The AI failed to read the resume '${resumeFile.name}'. The file may be corrupted, password-protected, or in an unsupported format. Please try another file.`);
    }

    if (!extractedInfo || !extractedInfo.name) {
       throw new Error(`Could not parse resume '${resumeFile.name}'. The AI could not find key details like the candidate's name. Please ensure the file is a valid and clearly structured resume.`);
    }
    
    const resumeExperienceSummary = extractedInfo.summary || extractedInfo.experience.map(exp => `${exp.title} at ${exp.company}: ${exp.description}`).join('\n');
    const resumeFullTextForProfiling = `${extractedInfo.summary || ''}\n\nSkills: ${extractedInfo.skills.join(', ')}\n\nExperience:\n${resumeExperienceSummary}`;

    // 3. Perform analysis with score first.
    const analysis = await generateResumeMatchScore({ resumeSkills: extractedInfo.skills, resumeExperience: resumeExperienceSummary, jobDescription });
    if (!analysis) throw new Error('Core analysis failed to generate a score.');

    // 4. Perform all other analyses in parallel.
    const allOtherPromises = [
        generateHiringRecommendations({
            parsedResume: {
                name: extractedInfo.name,
                email: extractedInfo.email,
                skills: extractedInfo.skills,
                experience: extractedInfo.experience.map(e => ({...e, description: e.description || ''})),
                education: extractedInfo.education,
                summary: extractedInfo.summary,
            },
            jobDescription,
            overallScore: analysis.overallScore, // Use the real score
        }),
        generateCareerPersonalityProfile({ resumeSummary: resumeFullTextForProfiling }),
        predictSalary ? predictSalaryRange({ jobDescription, resumeSkills: extractedInfo.skills, resumeExperience: resumeExperienceSummary, country }) : Promise.resolve(null),
        (analyzeVideo && videoFile) ? analyzeVideoResume({ videoDataUri: await fileToDataUri(videoFile) }) : Promise.resolve(null),
        predictWorkLife ? predictWorkLifeBalance({ jobDescription, resumeExperience: resumeExperienceSummary }) : Promise.resolve(null),
        findNetworking ? findNetworkingOpportunities({ jobTitle: extractedInfo.experience[0]?.title || 'Professional', skills: extractedInfo.skills, location: country }) : Promise.resolve(null),
        ...(shouldRewriteResume ? [
            rewriteResume({ style: 'ats', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }),
            rewriteResume({ style: 'creative', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }),
            rewriteResume({ style: 'executive', summary: extractedInfo.summary, experience: extractedInfo.experience, skills: extractedInfo.skills }),
        ] : [Promise.resolve(null), Promise.resolve(null), Promise.resolve(null)]),
        shouldRoast ? roastResume({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        shouldBoost ? confidenceBooster({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        shouldCheckBrand ? personalBrandCheck({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        shouldDiscoverStrengths ? hiddenStrengthDiscovery({ resumeExperience: resumeExperienceSummary, resumeSkills: extractedInfo.skills }) : Promise.resolve(null),
        shouldAssessRisk ? careerRiskAssessment({ jobTitle: extractedInfo.experience[0]?.title || 'Unknown', industry: 'General', skills: extractedInfo.skills }) : Promise.resolve(null),
        shouldWarnSkills ? skillObsolescenceWarning({ skills: extractedInfo.skills }) : Promise.resolve(null),
        shouldVersion ? resumeVersionControl({ resumeSummary: extractedInfo.summary || '', jobDescription }) : Promise.resolve(null),
        (shouldAssessInternship || analysisMode === 'fresher') ? internshipReadiness({ resumeSummary: resumeFullTextForProfiling }) : Promise.resolve(null),
        candidateRanking ? rankCandidate({ overallScore: analysis.overallScore }) : Promise.resolve(null),
        teamBenchmarking ? benchmarkCandidate({ skills: extractedInfo.skills }) : Promise.resolve(null),
        hiringFunnelInsights ? getHiringFunnelInsights({ jobDescription }) : Promise.resolve(null),
        // International
        getResumeExports ? getResumeExports({ resumeData: JSON.stringify(extractedInfo) }) : Promise.resolve(null),
        getCountryRules ? getCountryResumeRules({ country }) : Promise.resolve(null),
        assessVisa ? assessVisaSponsorship({ country, jobTitle: extractedInfo.experience[0]?.title || 'Engineer', skills: extractedInfo.skills }) : Promise.resolve(null),
    ];

    const [
        recommendations, personalityProfile,
        salaryPrediction, videoAnalysis, workLifeBalance, networking,
        atsRewrite, creativeRewrite, executiveRewrite,
        roast, confidenceReport, brandCheck, hiddenStrengths, riskAssessment, skillWarning, versionSuggestion, internshipReport,
        ranking, benchmark, funnelInsights,
        resumeExports, countryRules, visaSponsorship,
    ] = await Promise.all(allOtherPromises);
    
    if (!recommendations) throw new Error('Hiring recommendations failed to generate.');

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
      resumeRewrite: (atsRewrite && creativeRewrite && executiveRewrite) ? { ats: atsRewrite as RewriteResumeOutput, creative: creativeRewrite as RewriteResumeOutput, executive: executiveRewrite as RewriteResumeOutput } : undefined,
      roast: roast || undefined,
      confidenceReport: confidenceReport || undefined,
      brandCheck: brandCheck || undefined,
      hiddenStrengths: hiddenStrengths || undefined,
      riskAssessment: riskAssessment || undefined,
      skillWarning: skillWarning || undefined,
      versionSuggestion: versionSuggestion || undefined,
      internshipReport: internshipReport || undefined,
      ranking: ranking || undefined,
      benchmark: benchmark || undefined,
      funnelInsights: funnelInsights || undefined,
      // International
      resumeExports: resumeExports || undefined,
      countryRules: countryRules || undefined,
      visaSponsorship: visaSponsorship || undefined,
    };
    return result;
}


export async function analyzeResume(prevState: FormState, formData: FormData): Promise<FormState> {
  const allEntries = Object.fromEntries(formData.entries());
  
  const dataToValidate = {
      ...allEntries,
      resumeFiles: formData.getAll('resumeFile').filter(f => f instanceof File && f.size > 0),
  };
  
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
