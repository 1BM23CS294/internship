import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalyzedCandidate } from '@/lib/types';
import {
  CheckCircle2,
  ShieldAlert,
  Award,
  BookCheck,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

function PerformanceMetric({ label, score, icon: Icon }: { label: string, score: number, icon: React.ElementType }) {
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
      <Card className='bg-card/50'>
        <CardHeader>
          <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                  <CardTitle className="text-xl font-bold sm:text-2xl">{candidate.name}</CardTitle>
                  <CardDescription>Analysis based on file: {data.fileName}</CardDescription>
              </div>
              <Badge variant="outline" className='text-sm border-primary/50 text-primary'>New Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
            <Card className='bg-card/30'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary"><Award size={20} /> Overall Score</CardTitle>
                </CardHeader>
                <CardContent className='text-center flex flex-col items-center justify-center p-8 space-y-2'>
                    <h2 className={cn("text-6xl font-bold tracking-tighter sm:text-7xl", getScoreColor(analysis.overallScore))}>
                        {analysis.overallScore.toFixed(1)}<span className='text-3xl text-foreground/50 sm:text-4xl'>/10</span>
                    </h2>
                    <Badge variant='secondary' className={cn("text-base", getScoreColor(analysis.overallScore))}>
                        {analysis.rating}
                    </Badge>
                    <p className="text-sm text-foreground/60 max-w-md mx-auto pt-2 sm:text-base">{analysis.explanation}</p>
                    <Progress value={analysis.overallScore * 10} className='max-w-md mt-2 h-3' indicatorClassName={getScoreColor(analysis.overallScore, true)} />
                </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card className='bg-card/30'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-400"><CheckCircle2 size={20} /> Top Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {recommendations.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                 <Card className='bg-card/30'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-400"><ShieldAlert size={20} /> Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {recommendations.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card className='bg-card/30'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary"><BookCheck size={20} /> Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                   <PerformanceMetric label="Formatting" score={performanceMetrics.formatting.score} icon={Award} />
                   <PerformanceMetric label="Content Quality" score={performanceMetrics.contentQuality.score} icon={Award} />
                   <PerformanceMetric label="ATS Compatibility" score={performanceMetrics.atsCompatibility.score} icon={Award} />
                   <PerformanceMetric label="Keyword Usage" score={performanceMetrics.keywordUsage.score} icon={Award} />
                   <PerformanceMetric label="Quantified Results" score={performanceMetrics.quantifiedResults.score} icon={Award} />
                </CardContent>
            </Card>

        </CardContent>
      </Card>
    </div>
  );
}
