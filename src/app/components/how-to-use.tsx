'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, FileText, Sparkles, Flame, Search, TrendingDown, GitCompareArrows, School, Fingerprint, AlertTriangle, Briefcase, DollarSign, PenSquare, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'Core Analysis',
    icon: <FileText className="w-8 h-8 text-primary" />,
    description: 'The foundational analysis. Upload a resume and job description to get an overall match score, performance metrics (like ATS compatibility), and AI-driven hiring recommendations.',
  },
  {
    title: 'Resume Roast',
    icon: <Flame className="w-8 h-8 text-primary" />,
    description: "Get fun but brutally honest feedback. The AI 'roasts' the resume, pointing out weaknesses in a humorous way, with actionable takeaways.",
  },
  {
    title: 'Confidence Booster',
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    description: 'Generates a positive report highlighting the candidate\'s key strengths, most impactful achievements, and an empowering professional summary.',
  },
  {
    title: 'Personal Brand Check',
    icon: <Fingerprint className="w-8 h-8 text-primary" />,
    description: 'Scores the resume for brand consistency. It identifies the key themes and suggests ways to make the professional brand clearer and more impactful.',
  },
  {
    title: 'Hidden Strength Discovery',
    icon: <Search className="w-8 h-8 text-primary" />,
    description: 'The AI analyzes patterns in the resume to uncover valuable "soft skills" or strengths that are implied but not explicitly stated, like leadership or adaptability.',
  },
  {
    title: 'Career Risk Assessment',
    icon: <TrendingDown className="w-8 h-8 text-primary" />,
    description: 'Assesses the stability of the candidate\'s career path based on their industry and skills, providing a risk score and mitigation strategies.',
  },
   {
    title: 'Skill Obsolescence Warning',
    icon: <AlertTriangle className="w-8 h-8 text-primary" />,
    description: 'Identifies skills listed on the resume that are becoming outdated and suggests modern, in-demand alternatives to stay competitive.',
  },
   {
    title: 'AI Resume Versioning',
    icon: <GitCompareArrows className="w-8 h-8 text-primary" />,
    description: 'Provides AI-powered suggestions for tailoring and optimizing a resume specifically for the target job description you provided.',
  },
  {
    title: 'Internship & Fresher Mode',
    icon: <School className="w-8 h-8 text-primary" />,
    description: 'A special analysis mode for students and recent graduates. It calculates an "Internship Readiness Score" and gives targeted feedback for entry-level roles.',
  },
  {
    title: 'Executive Mode',
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    description: 'Tailors the analysis for senior-level professionals, focusing on leadership, strategic impact, and business outcomes rather than just technical skills.',
  },
  {
    title: 'Salary Prediction',
    icon: <DollarSign className="w-8 h-8 text-primary" />,
    description: 'Estimates a realistic salary range for the role in the specified country, based on the job description and the candidate\'s skills and experience.',
  },
  {
    title: 'AI Resume Rewriter',
    icon: <PenSquare className="w-8 h-8 text-primary" />,
    description: 'Rewrites the resume in three different professional styles: ATS-Friendly (for machines), Creative (for humans), and Executive (for leaders).',
  },
];


function FlipCard({ feature }: { feature: { title: string; icon: React.ReactNode; description: string } }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flip-card h-56 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={cn("flip-card-inner relative w-full h-full text-center", isFlipped && "rotate-y-180")}>
        {/* Front of the card */}
        <div className="flip-card-front absolute w-full h-full bg-black/40 border border-primary/30 rounded-lg flex flex-col items-center justify-center p-4">
          {feature.icon}
          <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
           <div className='absolute bottom-2 right-2 text-muted-foreground/50'>
              <RefreshCw size={12}/>
           </div>
        </div>
        {/* Back of the card */}
        <div className="flip-card-back absolute w-full h-full bg-black/40 border border-primary/30 rounded-lg p-4 rotate-y-180 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">{feature.description}</p>
           <div className='absolute bottom-2 right-2 text-muted-foreground/50'>
              <RefreshCw size={12}/>
           </div>
        </div>
      </div>
    </div>
  );
}


export function HowToUse() {
  return (
    <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Bot size={22} /> How It Works
        </CardTitle>
         <p className="text-sm text-muted-foreground pt-1 !mt-1">Click on any feature card to learn more about it.</p>
      </CardHeader>
      <CardContent>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <FlipCard key={index} feature={feature} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
