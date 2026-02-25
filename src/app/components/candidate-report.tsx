import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AnalyzedCandidate } from '@/lib/types';
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
} from 'lucide-react';

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

function getScoreBgColor(score: number) {
    if (score >= 80) return 'bg-green-400/10';
    if (score >= 60) return 'bg-yellow-400/10';
    return 'bg-red-400/10';
}


export function CandidateReport({ data }: { data: AnalyzedCandidate }) {
  const { candidate, matchScore, recommendations } = data;
  const scoreOutOf10 = (matchScore.matchScore / 10).toFixed(1);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                  <CardTitle className="text-2xl font-bold">{candidate.name}</CardTitle>
                  <CardDescription>Analysis based on file: {data.fileName}</CardDescription>
              </div>
              <Badge variant="outline" className='text-sm'>New Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
            <Card className={`p-6 ${getScoreBgColor(matchScore.matchScore)}`}>
                <div className='flex flex-wrap items-center justify-between gap-4'>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground/80 flex items-center gap-2"><Award size={20}/> Overall Score</h3>
                        <p className={`text-5xl font-bold ${getScoreColor(matchScore.matchScore)}`}>{scoreOutOf10}<span className='text-3xl text-foreground/50'>/10</span></p>
                        <p className='text-sm font-medium text-foreground/80 mt-1'>{matchScore.matchScore >= 80 ? "Excellent" : matchScore.matchScore >= 60 ? "Good" : "Needs Improvement"}</p>
                    </div>
                    <div className='w-full sm:w-auto mt-4 sm:mt-0'>
                        <p className="text-sm text-foreground/60 mb-2">{matchScore.explanation}</p>
                        <Progress value={matchScore.matchScore} className="h-2" indicatorClassName={getScoreColor(matchScore.matchScore).replace('text-', 'bg-')}/>
                    </div>
                </div>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-400"><CheckCircle size={20} /> Top Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {recommendations.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-400"><XCircle size={20} /> Main Improvements</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {recommendations.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary"><HelpCircle size={20} /> Suggested Interview Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-decimal pl-5 space-y-2 text-sm text-foreground/80">
                        {recommendations.interviewQuestions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                </CardContent>
            </Card>

        </CardContent>
      </Card>
    </div>
  );
}
