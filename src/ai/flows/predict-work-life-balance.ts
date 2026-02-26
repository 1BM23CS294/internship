'use server';
/**
 * @fileOverview A placeholder AI flow for predicting work-life balance.
 *
 * - predictWorkLifeBalance - A function that returns a mock work-life balance analysis.
 * - PredictWorkLifeBalanceInput - The input type for the function.
 * - WorkLifeBalanceOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictWorkLifeBalanceInputSchema = z.object({
  jobDescription: z.string().describe('The full text of the job description.'),
  resumeExperience: z
    .string()
    .describe("A summary of the candidate's work experience."),
});
export type PredictWorkLifeBalanceInput = z.infer<
  typeof PredictWorkLifeBalanceInputSchema
>;

const WorkLifeBalanceOutputSchema = z.object({
  balanceScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A score from 0-100, where 100 represents an excellent predicted work-life balance.'
    ),
  predictedHoursPerWeek: z
    .string()
    .describe('An estimated range of weekly working hours (e.g., "40-45").'),
  flexibility: z
    .string()
    .describe(
      'An assessment of the job\'s likely flexibility (e.g., "High", "Medium", "Low").'
    ),
  explanation: z
    .string()
    .describe(
      'A brief explanation for the prediction, based on role responsibilities and industry norms.'
    ),
});
export type WorkLifeBalanceOutput = z.infer<
  typeof WorkLifeBalanceOutputSchema
>;

export async function predictWorkLifeBalance(
  input: PredictWorkLifeBalanceInput
): Promise<WorkLifeBalanceOutput> {
  return predictWorkLifeBalanceFlow(input);
}

// This is a placeholder flow that returns mock data.
const predictWorkLifeBalanceFlow = ai.defineFlow(
  {
    name: 'predictWorkLifeBalanceFlow',
    inputSchema: PredictWorkLifeBalanceInputSchema,
    outputSchema: WorkLifeBalanceOutputSchema,
  },
  async (input) => {
    // In a real implementation, this would analyze the text for cues about work culture.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time

    let score = 75;
    let explanation = "The role seems to be a standard 9-to-5 position with typical industry demands. The job description does not mention on-call duties or frequent travel, suggesting a good work-life balance.";
    if (input.jobDescription.toLowerCase().includes('fast-paced') || input.jobDescription.toLowerCase().includes('startup')) {
        score -= 15;
        explanation = "The role is in a fast-paced startup environment, which often requires longer hours and high adaptability, potentially impacting work-life balance.";
    }
    
    return {
      balanceScore: score,
      predictedHoursPerWeek: "40-50",
      flexibility: "Medium",
      explanation,
    };
  }
);
