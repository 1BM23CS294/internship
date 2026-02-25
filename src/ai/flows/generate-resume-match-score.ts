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

const PerformanceMetricSchema = z.object({
  score: z.number().min(0).max(10).describe('The score for this metric, from 0 to 10.'),
  explanation: z.string().describe('A brief explanation for the score.'),
});

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
  performanceMetrics: z.object({
    formatting: PerformanceMetricSchema.describe('Assesses resume layout, readability, and professional presentation.'),
    contentQuality: PerformanceMetricSchema.describe('Evaluates the clarity, impact, and relevance of the content, including action verbs and achievements.'),
    atsCompatibility: PerformanceMetricSchema.describe('Scores how well the resume is optimized for Applicant Tracking Systems (ATS), based on standard formatting and keywords.'),
    keywordUsage: PerformanceMetricSchema.describe('Measures the presence and relevance of keywords from the job description within the resume.'),
    quantifiedResults: PerformanceMetricSchema.describe('Scores the use of numbers and data to demonstrate achievements and impact (e.g., "Increased sales by 20%").'),
  }).describe('A detailed breakdown of performance metrics.'),
});
export type GenerateResumeMatchScoreOutput = z.infer<typeof GenerateResumeMatchScoreOutputSchema>;


export async function generateResumeMatchScore(
  input: GenerateResumeMatchScoreInput
): Promise<GenerateResumeMatchScoreOutput> {
  return generateResumeMatchScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumeMatchScorePrompt',
  input: {schema: GenerateResumeMatchScoreInputSchema},
  output: {schema: GenerateResumeMatchScoreOutputSchema},
  prompt: `You are an expert HR and recruitment analyst AI. Your task is to provide a comprehensive analysis of a candidate's resume against a given job description.

Based on the resume skills, experience, and the job description, you must generate a detailed report in JSON format.

The report must include:
1.  **overallScore**: A single, holistic score from 0 to 100 that represents the candidate's suitability for the role. 100 is a perfect match.
2.  **rating**: A one-word qualitative rating based on the score (e.g., "Excellent", "Good", "Needs Improvement").
3.  **explanation**: A concise summary explaining the rationale behind the overall score.
4.  **performanceMetrics**: A detailed breakdown of the resume across five key areas. For each metric, provide a score from 0 to 10 and a brief explanation.
    - **formatting**: Assess layout, readability, and professional presentation.
    - **contentQuality**: Evaluate the clarity, impact, and relevance of the content, including the use of action verbs and achievements.
    - **atsCompatibility**: Score how well the resume is optimized for Applicant Tracking Systems (ATS) based on standard formatting, structure, and keywords.
    - **keywordUsage**: Measure how effectively the resume incorporates relevant keywords and phrases from the job description.
    - **quantifiedResults**: Score the use of numbers, data, and metrics to demonstrate tangible achievements (e.g., "Increased revenue by 15%").

Here is the data to analyze:

**Resume Skills:**
{{#each resumeSkills}}- {{{this}}}
{{/each}}

**Resume Experience Summary:**
{{{resumeExperience}}}

**Job Description:**
{{{jobDescription}}}

Please provide your full analysis in the specified JSON format.`,
});

const generateResumeMatchScoreFlow = ai.defineFlow(
  {
    name: 'generateResumeMatchScoreFlow',
    inputSchema: GenerateResumeMatchScoreInputSchema,
    outputSchema: GenerateResumeMatchScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
