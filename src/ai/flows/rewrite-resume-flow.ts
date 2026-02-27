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

const mockData: Record<string, RewriteResumeOutput> = {
  ats: {
    rewrittenSummary: "Results-driven Software Engineer with 5+ years of experience in full-stack web development, specializing in React, Node.js, and cloud-native technologies. Proven track record of delivering high-quality, scalable applications. Proficient in Agile methodologies, CI/CD pipelines, and automated testing.",
    rewrittenExperience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        rewrittenDescription: "- Engineered and launched 5+ new features for a flagship SaaS product, resulting in a 15% increase in user engagement.\n- Optimized application performance by 30% through code refactoring and database query improvements.\n- Mentored 3 junior developers in best practices for modern web development."
      },
      {
        title: "Software Engineer",
        company: "Innovate Co.",
        rewrittenDescription: "- Developed and maintained front-end components using React and TypeScript.\n- Collaborated with cross-functional teams to define and implement application requirements.\n- Implemented automated tests, increasing code coverage by 40%."
      }
    ]
  },
  creative: {
    rewrittenSummary: "A passionate full-stack developer who thrives on transforming complex problems into elegant, user-centric solutions. With a knack for both front-end polish and back-end robustness, I build digital experiences that are not only functional but also delightful to use. Always learning, always building.",
    rewrittenExperience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        rewrittenDescription: "As a key architect of the company's flagship product, I breathed life into new features that captured user imagination and boosted engagement. My focus on clean, efficient code wasn't just about performance—it was about crafting a seamless experience, a mission that led to a 30% speed improvement. I also had the privilege of guiding the next generation of coders, fostering a culture of growth and innovation."
      },
      {
        title: "Software Engineer",
        company: "Innovate Co.",
        rewrittenDescription: "At the heart of the innovation engine, I translated ideas into tangible reality with React and TypeScript. I was a bridge between design and engineering, ensuring every pixel and every interaction served a purpose. My work on automated testing helped build a foundation of quality and trust."
      }
    ]
  },
  executive: {
    rewrittenSummary: "A strategic Senior Software Engineer with a proven history of delivering business value through technical excellence. My expertise lies in architecting and executing scalable, high-impact software solutions that align with corporate objectives. I am adept at leading technical initiatives and mentoring teams to drive productivity and innovation, directly contributing to measurable outcomes like improved user engagement and operational efficiency.",
    rewrittenExperience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        rewrittenDescription: "- Drove a 15% uplift in key user engagement metrics by leading the end-to-end development of new product features.\n- Generated significant operational savings by spearheading a performance optimization initiative that improved system efficiency by 30%.\n- Enhanced team productivity by establishing and mentoring a high-performing development pod."
      },
      {
        title: "Software Engineer",
        company: "Innovate Co.",
        rewrittenDescription: "- Contributed to core product development, delivering robust front-end architecture to support strategic business goals.\n- Partnered with stakeholders across product and design to ensure technical solutions met market demands.\n- Mitigated future risk and maintenance costs by implementing a comprehensive testing strategy that improved code coverage by 40%."
      }
    ]
  }
};


// This is a placeholder flow that returns mock data for stability.
const rewriteResumeFlow = ai.defineFlow(
  {
    name: 'rewriteResumeFlow',
    inputSchema: RewriteResumeInputSchema,
    outputSchema: RewriteResumeOutputSchema,
  },
  async (input) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
    
    // Return a realistic mock based on the style
    const output = mockData[input.style];

    // To make it more realistic, we'll use the titles and companies from the actual input
    // but the rewritten descriptions from our mock data.
    const rewrittenExperience = input.experience.map((exp, index) => {
        return {
            title: exp.title,
            company: exp.company,
            rewrittenDescription: output.rewrittenExperience[index]?.rewrittenDescription || "Successfully executed key responsibilities and achieved significant results in this role."
        }
    });

    return {
        rewrittenSummary: output.rewrittenSummary,
        rewrittenExperience: rewrittenExperience,
    };
  }
);
