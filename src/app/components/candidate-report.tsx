

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AnalyzedCandidate } from '@/lib/types';
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  Mail,
  HelpCircle,
  Phone,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CircularProgress } from './circular-progress';

function getInitials(name: string) {
  if (!name) return '??';
  return name
    .split(' ')
    .map(n => n[0])
    .filter(c => /[a-zA-Z]/.test(c))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function CandidateReport({ data }: { data: AnalyzedCandidate }) {
  const { candidate, matchScore, recommendations } = data;
  const avatarPlaceholder = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary shadow-sm">
                <AvatarImage src={avatarPlaceholder?.imageUrl} alt={candidate.name} data-ai-hint={avatarPlaceholder?.imageHint} />
                <AvatarFallback className="text-2xl bg-muted">{getInitials(candidate.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold leading-none tracking-tight">{candidate.name}</h2>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm mt-2 text-muted-foreground">
                  {candidate.email && <span className="flex items-center gap-1.5"><Mail size={14} /> {candidate.email}</span>}
                  {candidate.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {candidate.phone}</span>}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularProgress value={matchScore.matchScore} size={110} strokeWidth={8} />
              <h3 className="font-semibold text-muted-foreground mt-1">Match Score</h3>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><Sparkles size={18} /> AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary/90 leading-relaxed">{matchScore.explanation}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase size={18} /> Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {candidate.experience.length > 0 ? candidate.experience.map((exp, index) => (
                  <div key={index} className="pl-4 border-l-2 border-primary/50 relative">
                     <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1 border-2 border-card"></div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className='font-medium text-muted-foreground'>{exp.company}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {exp.startDate} {exp.endDate ? ` - ${exp.endDate}` : '- Present'}
                    </p>
                    <p className="text-sm mt-2 text-muted-foreground/80">{exp.description}</p>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No work experience found.</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><GraduationCap size={18} /> Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.education.length > 0 ? candidate.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{edu.year}</p>
                    </div>
                    {index < candidate.education.length -1 && <Separator className='mt-4'/>}
                  </div>
                )) : <p className="text-sm text-muted-foreground">No education information found.</p>}
              </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target size={18} /> Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.length > 0 ? candidate.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className='text-sm font-normal'>{skill}</Badge>
                )) : <p className="text-sm text-muted-foreground">No skills found.</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb size={18} /> Hiring Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger><div className='flex items-center gap-2'><TrendingUp className="text-emerald-500"/> Strengths</div></AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {recommendations.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger><div className='flex items-center gap-2'><TrendingDown className="text-rose-500"/> Weaknesses</div></AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {recommendations.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger><div className='flex items-center gap-2'><HelpCircle className="text-sky-500"/> Interview Questions</div></AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-decimal pl-5 space-y-2 text-sm">
                      {recommendations.interviewQuestions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Separator className="my-4"/>
              <div className="space-y-2">
                <h3 className="font-semibold text-base">Overall Recommendation:</h3>
                <p className="text-sm text-muted-foreground">{recommendations.overallRecommendation}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
