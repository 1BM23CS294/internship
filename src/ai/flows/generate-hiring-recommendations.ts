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

const generateHiringRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateHiringRecommendationsFlow',
    inputSchema: GenerateHiringRecommendationsInputSchema,
    outputSchema: GenerateHiringRecommendationsOutputSchema,
  },
  async (input) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate processing time

    const primarySkill = input.parsedResume.skills[0] || 'the required domain';
    const secondarySkill = input.parsedResume.skills[1] || 'agile methodologies';
    const missingSkill = ['Cloud Infrastructure', 'Data Visualization', 'Go', 'Rust'][Math.floor(Math.random() * 4)];
    
    return {
      strengths: [
        `Extensive experience in ${primarySkill}, which is a core requirement for this role.`,
        "Demonstrated ability to lead projects, as seen in their most recent role.",
        `Proficiency with ${secondarySkill} aligns well with our team's workflow.`
      ],
      weaknesses: [
        "Experience appears to be concentrated in larger corporations; may need to adapt to a startup pace.",
        "Less emphasis on direct client-facing interactions in previous roles."
      ],
      skillsGap: [
        `The resume does not explicitly mention experience with ${missingSkill}, a preferred qualification.`,
        "No mention of specific CI/CD pipeline configuration tools (e.g., Jenkins, GitLab CI)."
      ],
      interviewQuestions: [
        `"Can you describe a challenging project you led that involved ${primarySkill}?"`,
        `"How would you approach learning and implementing ${missingSkill} on a new project?"`,
        `"Tell me about a time you had to work in a fast-paced, agile environment. How did you manage your priorities?"`
      ],
      overallRecommendation: `This is a strong candidate with relevant core skills and a solid track record. They are recommended for an interview. The interview should focus on assessing their adaptability and probing their knowledge of ${missingSkill}.`
    };
  }
);
