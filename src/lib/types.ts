import type {
  ExtractResumeInformationOutput,
  GenerateHiringRecommendationsOutput,
  GenerateResumeMatchScoreOutput,
  PredictSalaryRangeOutput,
  GenerateCareerPersonalityProfileOutput,
  VideoAnalysisOutput,
  WorkLifeBalanceOutput,
  NetworkingOpportunitiesOutput
} from '@/ai/flows';

export type Candidate = ExtractResumeInformationOutput;
export type AnalysisResult = GenerateResumeMatchScoreOutput;
export type HiringRecommendations = GenerateHiringRecommendationsOutput;
export type SalaryPredictionResult = PredictSalaryRangeOutput;
export type CareerPersonalityProfile = GenerateCareerPersonalityProfileOutput;

// New optional types
export type { VideoAnalysisOutput } from '@/ai/flows';
export type { WorkLifeBalanceOutput } from '@/ai/flows';
export type { NetworkingOpportunitiesOutput } from '@/ai/flows';

export type AnalyzedCandidate = {
  id: string;
  fileName: string;
  candidate: Candidate;
  analysis: AnalysisResult;
  recommendations: HiringRecommendations;
  personalityProfile: CareerPersonalityProfile;
  // Optional analysis results
  salaryPrediction?: SalaryPredictionResult;
  videoAnalysis?: VideoAnalysisOutput;
  workLifeBalance?: WorkLifeBalanceOutput;
  networking?: NetworkingOpportunitiesOutput;
};
