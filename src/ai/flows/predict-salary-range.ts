'use server';
/**
 * @fileOverview A Genkit flow for predicting a salary range for a candidate.
 *
 * - predictSalaryRange - A function that handles the salary prediction.
 * - PredictSalaryRangeInput - The input type for the predictSalaryRange function.
 * - PredictSalaryRangeOutput - The return type for the predictSalaryRange function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictSalaryRangeInputSchema = z.object({
  jobDescription: z
    .string()
    .describe(
      'The full text of the job description, including title and location if available.'
    ),
  resumeSkills: z
    .array(z.string())
    .describe("A list of skills extracted from the candidate's resume."),
  resumeExperience: z
    .string()
    .describe(
      "A summary of the work experience from the candidate's resume."
    ),
  country: z
    .string()
    .describe('The country for which to predict the salary (e.g., "USA", "GBR").'),
});
export type PredictSalaryRangeInput = z.infer<
  typeof PredictSalaryRangeInputSchema
>;

const PredictSalaryRangeOutputSchema = z.object({
  predictedMinSalary: z
    .number()
    .describe('The predicted minimum annual salary in the local currency.'),
  predictedMaxSalary: z
    .number()
    .describe('The predicted maximum annual salary in the local currency.'),
  currency: z.string().describe('The currency code of the predicted salary (e.g., "USD", "GBP", "EUR").'),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A confidence score (0-100) for the prediction accuracy.'),
  explanation: z
    .string()
    .describe(
      'An explanation of the factors that influenced the salary prediction (e.g., experience level, key skills, market demand).'
    ),
  optimizationTips: z
    .array(z.string())
    .describe(
      'A list of actionable tips for the candidate to potentially increase their salary for this type of role (e.g., "Acquire certification in AWS", "Gain experience with project management tools").'
    ),
});
export type PredictSalaryRangeOutput = z.infer<
  typeof PredictSalaryRangeOutputSchema
>;

export async function predictSalaryRange(
  input: PredictSalaryRangeInput
): Promise<PredictSalaryRangeOutput> {
  return predictSalaryRangeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictSalaryRangePrompt',
  input: { schema: PredictSalaryRangeInputSchema },
  output: { schema: PredictSalaryRangeOutputSchema },
  prompt: `You are an expert compensation analyst and career coach. Your task is to predict a salary range for a candidate based on their resume, a given job description, and a specific country.

Analyze the provided job description, the candidate's skills, and their work experience to estimate a realistic annual salary range in the local currency for the specified country.

Also, provide a confidence score for your prediction, a brief explanation of the key factors influencing the salary range, and the correct currency code (e.g., USD, GBP, EUR, INR).

Finally, offer a few actionable optimization tips for the candidate to help them increase their earning potential for similar roles in the future.

**Job Description:**
{{{jobDescription}}}

**Country:** {{{country}}}

**Candidate Skills:**
{{#each resumeSkills}}
- {{{this}}}
{{/each}}

**Candidate Experience Summary:**
{{{resumeExperience}}}

Please provide your complete analysis in the specified JSON format. Ensure all fields are populated accurately.`,
});

const predictSalaryRangeFlow = ai.defineFlow(
  {
    name: 'predictSalaryRangeFlow',
    inputSchema: PredictSalaryRangeInputSchema,
    outputSchema: PredictSalaryRangeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to predict salary range: No output received from LLM.');
    }
    return output;
  }
);
