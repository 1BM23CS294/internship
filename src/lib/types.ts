import type {
  ExtractResumeInformationOutput,
  GenerateHiringRecommendationsOutput,
  GenerateResumeMatchScoreOutput,
} from '@/ai/flows';

export type Candidate = ExtractResumeInformationOutput;
export type AnalysisResult = GenerateResumeMatchScoreOutput;
export type HiringRecommendations = GenerateHiringRecommendationsOutput;

export type AnalyzedCandidate = {
  id: string;
  fileName: string;
  candidate: Candidate;
  analysis: AnalysisResult;
  recommendations: HiringRecommendations;
};
