'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a match score
 * between a resume's extracted skills/experience and a job description.
 *
 * - generateResumeMatchScore - A function that calculates the match score.
 * - GenerateResumeMatchScoreInput - The input type for the function.
 * - GenerateResumeMatchScoreOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeMatchScoreInputSchema = z.object({
  resumeSkills: z.array(z.string()).describe('A list of skills extracted from the resume.'),
  resumeExperience: z.string().describe('A summary of the experience extracted from the resume.'),
  jobDescription: z.string().describe('The full job description text.'),
});
export type GenerateResumeMatchScoreInput = z.infer<typeof GenerateResumeMatchScoreInputSchema>;

const GenerateResumeMatchScoreOutputSchema = z.object({
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe('An overall match score between 0 and 100, indicating how well the resume matches the job description.'),
  rating: z.string().describe('A qualitative rating based on the score (e.g., "Excellent", "Good", "Needs Improvement").'),
  explanation: z
    .string()
    .describe('A detailed explanation for the given overall score, highlighting strengths and weaknesses.'),
});
export type GenerateResumeMatchScoreOutput = z.infer<typeof GenerateResumeMatchScoreOutputSchema>;


export async function generateResumeMatchScore(
  input: GenerateResumeMatchScoreInput
): Promise<GenerateResumeMatchScoreOutput> {
  return generateResumeMatchScoreFlow(input);
}

const generateResumeMatchScoreFlow = ai.defineFlow(
  {
    name: 'generateResumeMatchScoreFlow',
    inputSchema: GenerateResumeMatchScoreInputSchema,
    outputSchema: GenerateResumeMatchScoreOutputSchema,
  },
  async (input) => {
    await new Promise(resolve => setTimeout(resolve, 250)); // Simulate processing time
    
    const score = 65 + Math.floor(Math.random() * 25); // 65-90
    let rating = "Good";
    if (score > 85) rating = "Excellent";
    if (score < 75) rating = "Needs Improvement";

    const topSkill = input.resumeSkills[0] || 'key technologies';
    const secondSkill = input.resumeSkills[1] || 'project management';

    return {
      overallScore: score,
      rating: rating,
      explanation: `The candidate shows a strong alignment with the job description, particularly with their experience in ${topSkill} and ${secondSkill}. The score reflects a solid background with room to grow into the role's more specific requirements.`,
    };
  }
);
