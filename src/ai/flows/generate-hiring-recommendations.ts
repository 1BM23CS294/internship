'use server';
/**
 * @fileOverview A Genkit flow for generating hiring recommendations.
 *
 * - generateHiringRecommendations - A function that handles the generation of hiring recommendations.
 * - GenerateHiringRecommendationsInput - The input type for the generateHiringRecommendations function.
 * - GenerateHiringRecommendationsOutput - The return type for the generateHiringRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParsedResumeSchema = z.object({
  name: z.string().describe('The full name of the candidate.'),
  email: z.string().email().describe('The email address of the candidate.'),
  skills: z.array(z.string()).describe('A list of skills possessed by the candidate.'),
  experience: z.array(z.object({
    title: z.string().describe('Job title.'),
    company: z.string().describe('Company name.'),
    startDate: z.string().describe('Start date of the experience (e.g., "YYYY-MM").'),
    endDate: z.string().optional().describe('End date of the experience (e.g., "YYYY-MM") or "Present".'),
    description: z.string().describe('Key responsibilities and achievements in bullet points.'),
  })).describe('A list of work experiences.'),
  education: z.array(z.object({
    degree: z.string().describe('Degree or qualification obtained.'),
    institution: z.string().describe('Educational institution.'),
    year: z.string().optional().describe('Graduation date (e.g., "YYYY").'),
  })).describe('A list of educational background.'),
  summary: z.string().optional().describe('A brief professional summary or objective.'),
}).describe('Structured data extracted from a candidate\'s resume.');

const GenerateHiringRecommendationsInputSchema = z.object({
  parsedResume: ParsedResumeSchema,
  jobDescription: z.string().describe('The full text of the job description.'),
});
export type GenerateHiringRecommendationsInput = z.infer<typeof GenerateHiringRecommendationsInputSchema>;

const GenerateHiringRecommendationsOutputSchema = z.object({
  strengths: z.array(z.string()).describe('A list of key strengths of the candidate relevant to the job description.'),
  weaknesses: z.array(z.string()).describe('A list of potential weaknesses or gaps in the candidate\'s profile relative to the job description.'),
  skillsGap: z.array(z.string()).describe("A list of key skills required by the job description that are missing from the candidate's resume."),
  interviewQuestions: z.array(z.string()).describe('A list of suggested interview questions to further assess the candidate.'),
  overallRecommendation: z.string().describe('An overall hiring recommendation and insight based on the analysis.'),
}).describe('AI-generated hiring recommendations and insights.');
export type GenerateHiringRecommendationsOutput = z.infer<typeof GenerateHiringRecommendationsOutputSchema>;

export async function generateHiringRecommendations(
  input: GenerateHiringRecommendationsInput
): Promise<GenerateHiringRecommendationsOutput> {
  return generateHiringRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHiringRecommendationsPrompt',
  input: { schema: GenerateHiringRecommendationsInputSchema },
  output: { schema: GenerateHiringRecommendationsOutputSchema },
  prompt: `You are an expert HR recruiter and talent acquisition specialist. Your task is to analyze a candidate's resume data against a specific job description.\n\nBased on the provided information, generate specific and data-driven hiring recommendations and insights.\n\nCandidate's Parsed Resume Data:\nName: {{{parsedResume.name}}}\nEmail: {{{parsedResume.email}}}\nSummary: {{{parsedResume.summary}}}\n\nSkills:\n{{#each parsedResume.skills}}- {{{this}}}\n{{/each}}\n\nExperience:\n{{#each parsedResume.experience}}\n  - Title: {{{this.title}}} at {{{this.company}}} ({{{this.startDate}}} - {{{this.endDate}}})\n    Description: {{{this.description}}}\n{{/each}}\n\nEducation:\n{{#each parsedResume.education}}\n  - Degree: {{{this.degree}}} from {{{this.institution}}} (Graduation: {{{this.year}}})\n{{/each}}\n\nJob Description:\n{{{jobDescription}}}\n\nPlease provide the following:\n1.  **Strengths**: Highlight the candidate's key strengths and relevant qualifications for this specific job.\n2.  **Weaknesses**: Identify any potential weaknesses, gaps, or areas where the candidate might not perfectly align with the job requirements.\n3.  **Interview Questions**: Suggest specific interview questions to probe deeper into the candidate's experience, skills, and potential weaknesses.\n4.  **Overall Recommendation**: Provide a concise overall recommendation and any additional insights for the hiring manager.\n5.  **Skills Gap**: Identify key skills from the job description that are missing from the candidate's resume.`,
});

const generateHiringRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateHiringRecommendationsFlow',
    inputSchema: GenerateHiringRecommendationsInputSchema,
    outputSchema: GenerateHiringRecommendationsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate hiring recommendations: No output received from LLM.');
    }
    return output;
  }
);
