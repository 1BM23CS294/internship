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

const prompt = ai.definePrompt({
  name: 'generateCareerPersonalityProfilePrompt',
  input: { schema: GenerateCareerPersonalityProfileInputSchema },
  output: { schema: GenerateCareerPersonalityProfileOutputSchema },
  prompt: `You are an expert career psychologist and professional profiler. Your task is to analyze the provided resume summary to create a career-focused personality profile.

Based on the candidate's experience, skills, and the language used, assess their professional personality traits. Identify a primary archetype and provide scores for key traits.

**Key Traits to Assess:**
-   **Leadership & Initiative:** Proactive, takes charge, guides others.
-   **Collaboration & Teamwork:** Works well with others, supportive, communicative.
-   **Adaptability & Problem-Solving:** Flexible, resourceful, handles challenges effectively.
-   **Attention to Detail & Conscientiousness:** Meticulous, organized, reliable, follows through.
-   **Creativity & Innovation:** Thinks outside the box, generates new ideas, artistic inclinations.
-   **Strategic Thinking:** Sees the big picture, plans for the long-term, analytical.

For each trait, provide a score from 0-100 and cite brief evidence from the resume content.

**Resume Summary:**
{{{resumeSummary}}}

Please provide your full analysis in the specified JSON format.
`,
});

const generateCareerPersonalityProfileFlow = ai.defineFlow(
  {
    name: 'generateCareerPersonalityProfileFlow',
    inputSchema: GenerateCareerPersonalityProfileInputSchema,
    outputSchema: GenerateCareerPersonalityProfileOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate career personality profile.');
    }
    return output;
  }
);
