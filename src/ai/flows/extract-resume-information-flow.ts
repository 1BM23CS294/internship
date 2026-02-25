'use server';
/**
 * @fileOverview An AI agent that extracts key information from an uploaded resume.
 *
 * - extractResumeInformation - A function that handles the resume information extraction process.
 * - ExtractResumeInformationInput - The input type for the extractResumeInformation function.
 * - ExtractResumeInformationOutput - The return type for the extractResumeInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExperienceSchema = z.object({
  title: z.string().describe('The job title or role.'),
  company: z.string().describe('The company where the experience was gained.'),
  startDate: z
    .string()
    .describe(
      'The start date of the experience (e.g., "YYYY-MM" or "Month YYYY").'
    ),
  endDate: z
    .string()
    .optional()
    .describe(
      'The end date of the experience (e.g., "YYYY-MM" or "Month YYYY"), or "Present" if current.'
    ),
  description: z
    .string()
    .describe('A brief description of responsibilities and achievements.'),
});

const EducationSchema = z.object({
  degree: z
    .string()
    .describe('The degree obtained (e.g., Bachelor of Science, MBA).'),
  institution: z.string().describe('The educational institution attended.'),
  year: z.string().describe('The year of graduation or completion.'),
});

const ExtractResumeInformationInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractResumeInformationInput = z.infer<
  typeof ExtractResumeInformationInputSchema
>;

const ExtractResumeInformationOutputSchema = z.object({
  name: z.string().describe("The candidate's full name."),
  email: z.string().email().describe("The candidate's email address."),
  phone: z
    .string()
    .optional()
    .describe("The candidate's phone number, if available."),
  skills: z
    .array(z.string())
    .describe(
      'A list of key skills extracted from the resume (e.g., "Python", "Project Management", "Data Analysis").'
    ),
  experience: z
    .array(ExperienceSchema)
    .describe(
      'A list of work experiences, each with title, company, start date, end date, and description.'
    ),
  education: z
    .array(EducationSchema)
    .describe('A list of educational background entries.'),
  summary: z
    .string()
    .optional()
    .describe(
      'A brief, high-level summary of the candidate based on the resume content.'
    ),
  detectedLanguage: z
    .string()
    .describe(
      'The detected language of the original resume (e.g., "Spanish", "English"). Return "English" if no translation was needed.'
    ),
});
export type ExtractResumeInformationOutput = z.infer<
  typeof ExtractResumeInformationOutputSchema
>;

export async function extractResumeInformation(
  input: ExtractResumeInformationInput
): Promise<ExtractResumeInformationOutput> {
  return extractResumeInformationFlow(input);
}

const extractResumeInformationPrompt = ai.definePrompt({
  name: 'extractResumeInformationPrompt',
  input: {schema: ExtractResumeInformationInputSchema},
  output: {schema: ExtractResumeInformationOutputSchema},
  prompt: `You are an expert resume parser. Your task is to accurately extract key information from the provided resume.

First, detect the language of the provided resume. If it is not in English, translate the entire resume to English before proceeding. Use the English version for the extraction.

Then, analyze the document carefully and extract the following details into a structured JSON format:
- Candidate's full name
- Email address
- Phone number (if available)
- A list of key skills
- A list of work experiences, each including:
    - Job title or role
    - Company name
    - Start Date (e.g., "YYYY-MM" or "Month YYYY")
    - End Date (e.g., "YYYY-MM" or "Month YYYY", or "Present" if current)
    - A brief description of responsibilities and achievements
- A list of educational background entries, each including:
    - Degree obtained
    - Educational institution attended
    - Year of graduation or completion
- A brief, high-level summary of the candidate based on the resume content (optional).
- The detected language of the original resume. Return "English" if no translation was needed.

Ensure all extracted information is accurate and structured precisely according to the output schema provided. If a field is not found, omit it or use an empty string/array as appropriate, especially for optional fields.

Resume: {{media url=resumeDataUri}}`,
});

const extractResumeInformationFlow = ai.defineFlow(
  {
    name: 'extractResumeInformationFlow',
    inputSchema: ExtractResumeInformationInputSchema,
    outputSchema: ExtractResumeInformationOutputSchema,
  },
  async input => {
    const {output} = await extractResumeInformationPrompt(input);
    if (!output) {
      throw new Error('Failed to extract resume information.');
    }
    return output;
  }
);
