'use server';
/**
 * @fileOverview A Genkit flow for rewriting a resume in different professional styles.
 *
 * - rewriteResume - A function that handles the resume rewriting.
 * - RewriteResumeInput - The input type for the function.
 * - RewriteResumeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExperienceSchema = z.object({
  title: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string(),
});

const RewriteResumeInputSchema = z.object({
  style: z.enum(['ats', 'creative', 'executive']).describe('The target style for the resume rewrite (ats, creative, or executive).'),
  summary: z.string().optional().describe('The professional summary from the resume.'),
  experience: z.array(ExperienceSchema).describe('The work experience from the resume.'),
  skills: z.array(z.string()).describe('A list of skills from the resume.'),
});
export type RewriteResumeInput = z.infer<typeof RewriteResumeInputSchema>;

const RewrittenExperienceSchema = z.object({
  title: z.string(),
  company: z.string(),
  rewrittenDescription: z.string().describe('The rewritten description of responsibilities and achievements for this role.'),
});

const RewriteResumeOutputSchema = z.object({
  rewrittenSummary: z.string().describe('The rewritten professional summary.'),
  rewrittenExperience: z.array(RewrittenExperienceSchema).describe('The list of rewritten work experiences.'),
});
export type RewriteResumeOutput = z.infer<typeof RewriteResumeOutputSchema>;

export async function rewriteResume(
  input: RewriteResumeInput
): Promise<RewriteResumeOutput> {
  return rewriteResumeFlow(input);
}

const atsPrompt = `You are an expert resume writer specializing in optimizing resumes for Applicant Tracking Systems (ATS). Rewrite the following resume sections to be clear, concise, and packed with relevant keywords. Use standard formatting and action verbs. Focus on quantifiable achievements.

**Summary:**
{{{summary}}}

**Experience:**
{{#each experience}}
- **{{this.title}} at {{this.company}}**: {{this.description}}
{{/each}}

**Skills:**
{{#each skills}}- {{{this}}}{{/each}}

Rewrite the summary and each experience description based on these principles. Ensure the output is in the specified JSON format.`;

const creativePrompt = `You are an expert storyteller and brand strategist. Rewrite the following resume sections to be engaging, creative, and memorable. Use vivid language to showcase the candidate's personality and impact. Focus on painting a picture of their unique value.

**Summary:**
{{{summary}}}

**Experience:**
{{#each experience}}
- **{{this.title}} at {{this.company}}**: {{this.description}}
{{/each}}

**Skills:**
{{#each skills}}- {{{this}}}{{/each}}

Rewrite the summary and each experience description to tell a compelling story. Ensure the output is in the specified JSON format.`;

const executivePrompt = `You are an expert executive resume writer. Rewrite the following resume sections to be strategic, results-driven, and authoritative. Focus on high-level impact, leadership, and business outcomes. Use strong, confident language appropriate for a senior-level audience.

**Summary:**
{{{summary}}}

**Experience:**
{{#each experience}}
- **{{this.title}} at {{this.company}}**: {{this.description}}
{{/each}}

**Skills:**
{{#each skills}}- {{{this}}}{{/each}}

Rewrite the summary and each experience description to highlight strategic value and leadership. Ensure the output is in the specified JSON format.`;

const promptMap = {
    ats: atsPrompt,
    creative: creativePrompt,
    executive: executivePrompt,
};

const rewriteResumeFlow = ai.defineFlow(
  {
    name: 'rewriteResumeFlow',
    inputSchema: RewriteResumeInputSchema,
    outputSchema: RewriteResumeOutputSchema,
  },
  async (input) => {
    const promptTemplate = promptMap[input.style];

    const prompt = ai.definePrompt({
      name: `rewriteResumePrompt_${input.style}`,
      input: { schema: RewriteResumeInputSchema },
      output: { schema: RewriteResumeOutputSchema },
      prompt: promptTemplate,
    });
    
    const { output } = await prompt(input);
    if (!output) {
      throw new Error(`Failed to rewrite resume for style: ${input.style}`);
    }
    return output;
  }
);
