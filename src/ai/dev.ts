'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-resume-match-score.ts';
import '@/ai/flows/extract-resume-information-flow.ts';
import '@/ai/flows/generate-hiring-recommendations.ts';
import '@/ai/flows/predict-salary-range.ts';
import '@/ai/flows/generate-career-personality-profile.ts';
import '@/ai/flows/analyze-video-resume.ts';
import '@/ai/flows/predict-work-life-balance.ts';
import '@/ai/flows/find-networking-opportunities.ts';
