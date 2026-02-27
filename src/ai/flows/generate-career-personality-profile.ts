'use server';
/**
 * @fileOverview A Genkit flow for generating a career-focused personality profile from a resume.
 *
 * - generateCareerPersonalityProfile - A function that handles the profile generation.
 * - GenerateCareerPersonalityProfileInput - The input type for the function.
 * - GenerateCareerPersonalityProfileOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCareerPersonalityProfileInputSchema = z.object({
  resumeSummary: z.string().describe('A summary of the work experience, skills, and education from the candidate\'s resume.'),
});
export type GenerateCareerPersonalityProfileInput = z.infer<typeof GenerateCareerPersonalityProfileInputSchema>;

const PersonalityTraitSchema = z.object({
  trait: z.string().describe('The name of the personality trait (e.g., "Adaptability", "Leadership", "Attention to Detail").'),
  score: z.number().min(0).max(100).describe('A score from 0 to 100 representing the assessed level of this trait.'),
  evidence: z.string().describe('A brief explanation or evidence from the resume that supports the score.'),
});

const GenerateCareerPersonalityProfileOutputSchema = z.object({
  primaryProfile: z.string().describe('A primary career personality archetype identified from the resume (e.g., "Natural Leader", "Detail-Oriented Analyst", "Creative Innovator").'),
  summary: z.string().describe('A brief summary of the candidate\'s overall career personality.'),
  traits: z.array(PersonalityTraitSchema).describe('A list of key personality traits with scores and evidence.'),
});
export type GenerateCareerPersonalityProfileOutput = z.infer<typeof GenerateCareerPersonalityProfileOutputSchema>;

export async function generateCareerPersonalityProfile(
  input: GenerateCareerPersonalityProfileInput
): Promise<GenerateCareerPersonalityProfileOutput> {
  return generateCareerPersonalityProfileFlow(input);
}

// This is a placeholder flow that returns mock data for stability.
const generateCareerPersonalityProfileFlow = ai.defineFlow(
  {
    name: 'generateCareerPersonalityProfileFlow',
    inputSchema: GenerateCareerPersonalityProfileInputSchema,
    outputSchema: GenerateCareerPersonalityProfileOutputSchema,
  },
  async (input) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate processing time
    return {
      primaryProfile: "Detail-Oriented Analyst",
      summary: "Based on the resume, the candidate exhibits strong analytical skills and a methodical approach to problem-solving. They appear to be reliable, conscientious, and value precision in their work.",
      traits: [
        {
          trait: "Attention to Detail & Conscientiousness",
          score: 88,
          evidence: "Managed complex datasets and led a project that required high accuracy, suggesting a meticulous nature."
        },
        {
          trait: "Strategic Thinking",
          score: 75,
          evidence: "Involvement in long-term project planning indicates an ability to see the bigger picture."
        },
        {
          trait: "Collaboration & Teamwork",
          score: 72,
          evidence: "Worked in cross-functional teams, showing experience in collaborative environments."
        },
        {
          trait: "Leadership & Initiative",
          score: 65,
          evidence: "Led a small project team, indicating emerging leadership qualities."
        }
      ]
    };
  }
);
