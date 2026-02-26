import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalyzedCandidate } from '@/lib/types';
import {
  CheckCircle2,
  ShieldAlert,
  Award,
  BookCheck,
  BrainCircuit,
  ListMinus,
  Languages,
  User,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CircularProgress } from './circular-progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getScoreStyling } from '@/lib/theme';

function PerformanceMetric({ label, score, icon: Icon, explanation }: { label: string, score: number, icon: React.ElementType, explanation: string }) {
    const styling = getScoreStyling(score * 10); // score is 0-10, styling expects 0-100
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium">{label}</p>
                </div>
                <p className="text-sm font-semibold">{score}/10</p>
            </div>
            <Progress value={score * 10} indicatorClassName={styling.indicator} />
            <p className='text-xs text-muted-foreground'>{explanation}</p>
        </div>
    )
}

export function CandidateReport({ data }: { data: AnalyzedCandidate }) {
  const { candidate, analysis, recommendations } = data;
  const performanceMetrics = analysis.performanceMetrics;

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{candidate.name}</h2>
              <p className="text-sm text-muted-foreground">Analysis based on file: {data.fileName}</p>
          </div>
           <div className='flex flex-col items-end gap-2'>
             <Badge variant="outline" className='text-sm border-primary/50 text-primary'>New Analysis</Badge>
              {candidate.detectedLanguage && candidate.detectedLanguage.toLowerCase() !== 'english' && (
                <Badge variant="secondary" className="flex items-center gap-1.5">
                  <Languages size={14} />
                  Translated from {candidate.detectedLanguage}
                </Badge>
              )}
           </div>
      </div>
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
            <TabsTrigger value="details">Resume Details</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
            <Card className='bg-black/20 border border-primary/20'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl"><Award size={22} /> Overall Score & Recommendation</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col md:flex-row items-center justify-center gap-8 text-center p-8'>
                    <CircularProgress value={analysis.overallScore} />
                    <div className='max-w-md text-left space-y-4'>
                        <div>
                            <h3 className='text-xl font-bold text-foreground'>AI-Powered Analysis</h3>
                            <p className="text-base text-foreground/80">{analysis.explanation}</p>
                        </div>
                        <div>
                            <h4 className='font-semibold text-foreground flex items-center gap-2'><BrainCircuit size={16} /> Overall Recommendation</h4>
                            <p className='text-sm text-foreground/70'>{recommendations.overallRecommendation}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="performance" className="mt-6">
            <Card className='bg-black/20 border border-primary/20'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary"><BookCheck size={20} /> Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                <PerformanceMetric label="Formatting" score={performanceMetrics.formatting.score} explanation={performanceMetrics.formatting.explanation} icon={Award} />
                <PerformanceMetric label="Content Quality" score={performanceMetrics.contentQuality.score} explanation={performanceMetrics.contentQuality.explanation} icon={Award} />
                <PerformanceMetric label="ATS Compatibility" score={performanceMetrics.atsCompatibility.score} explanation={performanceMetrics.atsCompatibility.explanation} icon={Award} />
                <PerformanceMetric label="Keyword Usage" score={performanceMetrics.keywordUsage.score} explanation={performanceMetrics.keywordUsage.explanation} icon={Award} />
                <PerformanceMetric label="Quantified Results" score={performanceMetrics.quantifiedResults.score} explanation={performanceMetrics.quantifiedResults.explanation} icon={Award} />
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="recommendations" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
                <Card className='bg-black/20 border border-primary/20'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-400"><CheckCircle2 size={20} /> Top Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {recommendations.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card className='bg-black/20 border border-primary/20'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-400"><ShieldAlert size={20} /> Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {recommendations.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card className='bg-black/20 md:col-span-2 border border-primary/20'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-400"><ListMinus size={20} /> Skills Gap</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {recommendations.skillsGap.length > 0 ? recommendations.skillsGap.map((w, i) => <li key={i}>{w}</li>) : <p className='text-sm text-muted-foreground'>No significant skill gaps found.</p>}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            </TabsContent>
            <TabsContent value="details" className="mt-6">
                <Card className='bg-black/20 border border-primary/20'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary"><User size={20} /> Extracted Resume Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><BrainCircuit size={16}/> Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill, i) => <Badge key={i} variant="secondary">{skill}</Badge>)}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-4"><Briefcase size={16}/> Work Experience</h3>
                        <div className="space-y-4">
                            {candidate.experience.map((exp, i) => (
                                <div key={i} className="pl-4 border-l-2 border-primary/50">
                                    <p className="font-bold">{exp.title}</p>
                                    <p className="text-sm text-muted-foreground">{exp.company} | {exp.startDate} - {exp.endDate || 'Present'}</p>
                                    <p className="text-sm mt-1">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-4"><GraduationCap size={16}/> Education</h3>
                            <div className="space-y-4">
                            {candidate.education.map((edu, i) => (
                                <div key={i} className="pl-4 border-l-2 border-primary/50">
                                    <p className="font-bold">{edu.degree}</p>
                                    <p className="text-sm text-muted-foreground">{edu.institution} | {edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
