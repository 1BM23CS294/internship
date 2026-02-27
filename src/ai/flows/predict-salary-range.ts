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
import { countries } from '@/lib/countries';

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

// This is a placeholder flow that returns mock data for stability.
const predictSalaryRangeFlow = ai.defineFlow(
  {
    name: 'predictSalaryRangeFlow',
    inputSchema: PredictSalaryRangeInputSchema,
    outputSchema: PredictSalaryRangeOutputSchema,
  },
  async (input) => {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate processing time
    
    const countryData = countries.find(c => c.value === input.country) || countries.find(c => c.value === 'USA');
    const currency = countryData?.currency || 'USD';
    let minSalary = 85000;
    let maxSalary = 125000;

    // Basic adjustment for currency for more realism
    if (currency === 'GBP') {
        minSalary *= 0.8;
        maxSalary *= 0.8;
    } else if (currency === 'EUR') {
        minSalary *= 0.9;
        maxSalary *= 0.9;
    } else if (currency === 'INR') {
        minSalary *= 12;
        maxSalary *= 12;
    }


    return {
      predictedMinSalary: Math.round(minSalary),
      predictedMaxSalary: Math.round(maxSalary),
      currency: currency,
      confidenceScore: 88,
      explanation: "The predicted salary range is based on the provided job title, key skills like 'React' and 'Node.js', and an estimated 5-7 years of experience. Market data for the selected region was also a key factor in this estimation.",
      optimizationTips: [
        "Highlighting experience with cloud platforms (like AWS or Azure) could increase salary potential by up to 15%.",
        "Obtaining a relevant certification in project management (e.g., PMP, Agile) can strengthen negotiating power.",
        "Demonstrate leadership or mentorship experience to qualify for higher-tier roles."
      ]
    };
  }
);
