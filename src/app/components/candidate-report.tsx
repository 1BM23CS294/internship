import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalyzedCandidate } from '@/lib/types';
import {
  CheckCircle2,
  ShieldAlert,
  Award,
  BookCheck,
  BrainCircuit,
  ListMinus,
  Languages,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CircularProgress } from './circular-progress';

function PerformanceMetric({ label, score, icon: Icon, explanation }: { label: string, score: number, icon: React.ElementType, explanation: string }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium">{label}</p>
                </div>
                <p className="text-sm font-semibold">{score}/10</p>
            </div>
            <Progress value={score * 10} indicatorClassName={getScoreColor(score, true)} />
            <p className='text-xs text-muted-foreground'>{explanation}</p>
        </div>
    )
}

function getScoreColor(score: number, isBg = false) {
    if (score >= 8) return isBg ? 'bg-green-400' : 'text-green-400';
    if (score >= 6) return isBg ? 'bg-yellow-400' : 'text-yellow-400';
    return isBg ? 'bg-red-400' : 'text-red-400';
}

export function CandidateReport({ data }: { data: AnalyzedCandidate }) {
  const { candidate, analysis, recommendations } = data;
  const performanceMetrics = analysis.performanceMetrics;

  return (
    <div className="space-y-6">
      <Card className="bg-card/20 backdrop-blur-lg border-primary/10 p-2 sm:p-4">
        <CardHeader>
          <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                  <CardTitle className="text-2xl font-bold sm:text-3xl">{candidate.name}</CardTitle>
                  <CardDescription>Analysis based on file: {data.fileName}</CardDescription>
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
        </CardHeader>
        <CardContent className='space-y-8'>
            <Card className='bg-background/50 backdrop-blur-sm'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl"><Award size={22} /> Overall Score</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col md:flex-row items-center justify-center gap-8 text-center p-8'>
                    <CircularProgress value={analysis.overallScore} />
                    <div className='max-w-md text-left space-y-2'>
                        <h3 className='text-xl font-bold text-foreground'>AI-Powered Analysis</h3>
                        <p className="text-base text-foreground/80">{analysis.explanation}</p>

                        <div className='pt-4'>
                             <h4 className='font-semibold text-foreground flex items-center gap-2'><BrainCircuit size={16} /> Overall Recommendation</h4>
                             <p className='text-sm text-foreground/70'>{recommendations.overallRecommendation}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className='bg-background/50 backdrop-blur-sm'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-400"><CheckCircle2 size={20} /> Top Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {recommendations.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                 <Card className='bg-background/50 backdrop-blur-sm'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-400"><ShieldAlert size={20} /> Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {recommendations.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card className='bg-background/50 backdrop-blur-sm md:col-span-2 lg:col-span-1'>
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

            <Card className='bg-background/50 backdrop-blur-sm'>
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

        </CardContent>
      </Card>
    </div>
  );
}
