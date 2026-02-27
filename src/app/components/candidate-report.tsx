import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalyzedCandidate } from '@/lib/types';
import {
  CheckCircle2,
  ShieldAlert,
  Award,
  BrainCircuit,
  ListMinus,
  Languages,
  User,
  GraduationCap,
  Briefcase,
  DollarSign,
  TrendingUp,
  UserCog,
  Video,
  Smile,
  Voicemail,
  Lightbulb,
  Clock,
  Users,
  Calendar,
  Link as LinkIcon,
  PenSquare,
  Flame,
  Sparkles,
  Fingerprint,
  Search,
  TrendingDown,
  AlertTriangle,
  GitCompareArrows,
  School,
  Medal,
  Filter,
  FileJson,
  Globe,
  Ship,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CircularProgress } from './circular-progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getScoreStyling } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CandidateReport({ data }: { data: AnalyzedCandidate }) {
  const { 
    candidate, analysis, recommendations, salaryPrediction, personalityProfile, 
    videoAnalysis, workLifeBalance, networking, resumeRewrite,
    roast, confidenceReport, brandCheck, hiddenStrengths, riskAssessment, skillWarning, versionSuggestion, internshipReport,
    ranking, benchmark, funnelInsights,
    resumeExports, countryRules, visaSponsorship
  } = data;

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
      
      <div className="space-y-6">
        {/* Overview */}
        <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
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

        {/* AI Insights */}
        <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary text-xl"><BrainCircuit size={22} /> AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2 text-green-400"><CheckCircle2 size={20} /> Top Strengths</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                        {recommendations.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2 text-amber-400"><ShieldAlert size={20} /> Areas for Improvement</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                        {recommendations.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2 text-red-400"><ListMinus size={20} /> Skills Gap</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                        {recommendations.skillsGap.length > 0 ? recommendations.skillsGap.map((w, i) => <li key={i}>{w}</li>) : <p className='text-sm text-muted-foreground'>No significant skill gaps found.</p>}
                    </ul>
                </div>
            </CardContent>
        </Card>

        {roast && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <Flame size={20} /> Resume Roast
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Badge variant="destructive">{roast.roastLevel} Roast</Badge>
                    <blockquote className="border-l-2 pl-6 italic">{roast.roast}</blockquote>
                    <div>
                        <h4 className='font-semibold mb-3 flex items-center gap-2'>Constructive Takeaways</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {roast.constructiveTakeaways.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}

        {confidenceReport && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <Sparkles size={20} /> Confidence Booster
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center p-4 rounded-lg bg-black/20">
                        <p className="text-lg text-primary tracking-tight">{confidenceReport.empoweringStatement}</p>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-3'>Key Strengths</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {confidenceReport.keyStrengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className='font-semibold mb-3'>Achievement Highlights</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {confidenceReport.achievementHighlights.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}

        {brandCheck && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <Fingerprint size={20} /> Personal Brand Consistency
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="text-center p-6 rounded-lg bg-black/20 flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground">Brand Consistency Score</p>
                        <p className={cn("text-5xl font-bold tracking-tight my-2", getScoreStyling(brandCheck.consistencyScore).color)}>
                            {brandCheck.consistencyScore}<span className='text-3xl text-foreground/50'>/100</span>
                        </p>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-2'>Key Brand Themes Detected</h4>
                         <div className="flex flex-wrap gap-2">
                            {brandCheck.keyThemes.map((theme, i) => <Badge key={i} variant="secondary">{theme}</Badge>)}
                        </div>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-3'>Suggestions for Improvement</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {brandCheck.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}

        {hiddenStrengths && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <Search size={20} /> Hidden Strength Discovery
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {hiddenStrengths.hiddenStrengths.map((item, i) => (
                        <div key={i} className="pl-4 border-l-2 border-primary/50">
                            <p className="font-bold">{item.strength}</p>
                            <p className="text-sm text-muted-foreground mt-1"><strong>Evidence:</strong> {item.evidence}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )}

        {riskAssessment && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <TrendingDown size={20} /> Career Risk Assessment
                    </CardTitle>
                </CardHeader>
                 <CardContent className="space-y-6">
                     <div className="text-center p-6 rounded-lg bg-black/20 flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground">Automation Risk Score</p>
                        <p className={cn("text-5xl font-bold tracking-tight my-2", getScoreStyling(100 - riskAssessment.riskScore).color)}>
                            {riskAssessment.riskScore}<span className='text-3xl text-foreground/50'>/100</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">Outlook: {riskAssessment.stabilityOutlook}</p>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-3'>Risk Mitigation Strategies</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {riskAssessment.mitigationStrategies.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}

        {skillWarning && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <AlertTriangle size={20} /> Skill Obsolescence Warning
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {skillWarning.warnings.length > 0 ? skillWarning.warnings.map((warning, i) => (
                         <div key={i} className="p-3 bg-black/20 rounded-lg">
                            <div className='flex justify-between items-center mb-2'>
                                <p className='font-semibold'>{warning.skill}</p>
                                <Badge variant={warning.riskLevel === 'High' ? 'destructive' : 'secondary'}>{warning.riskLevel} Risk</Badge>
                            </div>
                            <p className='text-xs text-muted-foreground'><strong>Suggestion:</strong> {warning.suggestion}</p>
                        </div>
                    )) : <p className='text-sm text-muted-foreground text-center py-4'>No at-risk skills detected.</p>}
                </CardContent>
            </Card>
        )}
        
        {versionSuggestion && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <GitCompareArrows size={20} /> Resume Versioning AI
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className='font-semibold mb-2'>Suggested Summary (for this job)</h4>
                        <blockquote className="border-l-2 pl-6 italic text-sm">{versionSuggestion.suggestedVersionSummary}</blockquote>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-3'>Recommended Changes</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {versionSuggestion.changeLog.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}

        {internshipReport && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <School size={20} /> Internship Readiness
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center p-6 rounded-lg bg-black/20 flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground">Internship Readiness Score</p>
                        <p className={cn("text-5xl font-bold tracking-tight my-2", getScoreStyling(internshipReport.readinessScore).color)}>
                            {internshipReport.readinessScore}<span className='text-3xl text-foreground/50'>/100</span>
                        </p>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-3'>Project Highlights for Applications</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {internshipReport.projectHighlights.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-3'>Feedback for Improvement</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {internshipReport.feedback.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}
        
        {ranking && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl"><Medal size={20} /> Candidate Ranking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-black/20 rounded-lg">
                                <p className="text-3xl font-bold">#{ranking.rank}</p>
                                <p className="text-xs text-muted-foreground">Rank</p>
                            </div>
                            <div className="p-4 bg-black/20 rounded-lg">
                                <p className="text-3xl font-bold">{ranking.percentile}<span className='text-xl'>th</span></p>
                                <p className="text-xs text-muted-foreground">Percentile</p>
                            </div>
                            <div className="p-4 bg-black/20 rounded-lg">
                                <p className="text-3xl font-bold">{ranking.totalApplicants}</p>
                                <p className="text-xs text-muted-foreground">Total Applicants</p>
                            </div>
                    </div>
                     <div>
                        <h4 className='font-semibold mb-2'>Comparison Summary</h4>
                       <p className='text-sm text-muted-foreground'>{ranking.comparisonSummary}</p>
                    </div>
                </CardContent>
            </Card>
        )}

        {benchmark && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl"><Users size={20} /> Team Benchmarking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <blockquote className="border-l-2 pl-6 italic">{benchmark.benchmarkSummary}</blockquote>
                    <div>
                        <h4 className='font-semibold mb-3'>Strengths vs. Team Average</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {benchmark.strengthsVsTeam.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className='font-semibold mb-3'>Fills Existing Team Gaps In...</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {benchmark.gapsCandidateFills.map((g, i) => <li key={i}>{g}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}

        {funnelInsights && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl"><Filter size={20} /> Hiring Funnel Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-black/20 rounded-lg">
                                <p className="text-2xl font-bold">{funnelInsights.estimatedTimeToHire}</p>
                                <p className="text-xs text-muted-foreground">Est. Time to Hire</p>
                            </div>
                            <div className="p-4 bg-black/20 rounded-lg">
                                <p className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: funnelInsights.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(funnelInsights.predictedCostPerHire)}</p>
                                <p className="text-xs text-muted-foreground">Predicted Cost per Hire</p>
                            </div>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-3'>Funnel Optimization Tips</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {funnelInsights.funnelImprovementTips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}
        
        {videoAnalysis && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <Video size={20} /> AI Video Resume Feedback
                    </CardTitle>
                    <CardContent className="text-sm text-muted-foreground pt-2">This is a simulated analysis. In a real product, this would involve complex video processing models.</CardContent>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className='font-semibold mb-3 flex items-center gap-2'><Smile size={16} /> Facial Expression Analysis</h4>
                        <p className='text-sm text-muted-foreground mb-2'><strong>Overall Tone:</strong> {videoAnalysis.facialExpression.overallTone}</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
                            {videoAnalysis.facialExpression.keyExpressions.map((e, i) => <li key={i}>{e.expression} at {e.timestamp}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className='font-semibold mb-3 flex items-center gap-2'><Voicemail size={16} /> Voice Confidence Analysis</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-black/20 rounded-lg">
                                <p className="text-2xl font-bold">{videoAnalysis.voiceConfidence.clarityScore}%</p>
                                <p className="text-xs text-muted-foreground">Clarity Score</p>
                            </div>
                             <div className="p-3 bg-black/20 rounded-lg">
                                <p className="text-lg font-semibold">{videoAnalysis.voiceConfidence.fillerWordCount}</p>
                                <p className="text-xs text-muted-foreground">Filler Words</p>
                            </div>
                            <div className="p-3 bg-black/20 rounded-lg">
                                <p className="text-lg font-semibold capitalize">{videoAnalysis.voiceConfidence.pace}</p>
                                <p className="text-xs text-muted-foreground">Pacing</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-3 flex items-center gap-2'><Lightbulb size={16} /> Micro-Expression Coaching</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {videoAnalysis.microExpressionCoaching.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}
        
        {salaryPrediction && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <DollarSign size={20} /> Salary Prediction & Optimization
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center p-4 rounded-lg bg-black/20">
                        <p className="text-sm text-muted-foreground">Predicted Annual Salary Range ({salaryPrediction.currency})</p>
                        <p className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                            {`${new Intl.NumberFormat('en-US', { style: 'currency', currency: salaryPrediction.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(salaryPrediction.predictedMinSalary).replace(salaryPrediction.currency, '').trim()} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: salaryPrediction.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(salaryPrediction.predictedMaxSalary).replace(salaryPrediction.currency, '').trim()}`}
                        </p>
                    </div>
                    <div className='space-y-4'>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-muted-foreground">Prediction Confidence</p>
                                <p className="text-sm font-semibold">{salaryPrediction.confidenceScore}%</p>
                            </div>
                            <Progress value={salaryPrediction.confidenceScore} />
                        </div>
                         <div>
                            <h4 className='font-semibold mb-2'>Basis for Prediction</h4>
                            <p className='text-sm text-muted-foreground'>{salaryPrediction.explanation}</p>
                        </div>
                    </div>
                     <div>
                        <h4 className='font-semibold mb-3 flex items-center gap-2'><TrendingUp size={16} /> Salary Optimization Tips</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                            {salaryPrediction.optimizationTips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}
        
        {personalityProfile && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <UserCog size={20} /> Career Personality Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center p-4 rounded-lg bg-black/20">
                        <p className="text-sm text-muted-foreground">Primary Profile</p>
                        <p className="text-2xl font-bold text-primary tracking-tight">
                            {personalityProfile.primaryProfile}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">{personalityProfile.summary}</p>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                        {personalityProfile.traits.map(trait => (
                            <div key={trait.trait}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium">{trait.trait}</p>
                                    <p className="text-sm font-semibold">{trait.score}/100</p>
                                </div>
                                <Progress value={trait.score} />
                                <p className='text-xs text-muted-foreground mt-1.5'>{trait.evidence}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )}
        
        {workLifeBalance && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <Clock size={20} /> Work-Life Balance Predictor
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center p-6 rounded-lg bg-black/20 flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground">Predicted Balance Score</p>
                        <p className={cn("text-5xl font-bold tracking-tight my-2", getScoreStyling(workLifeBalance.balanceScore).color)}>
                            {workLifeBalance.balanceScore}
                            <span className='text-3xl text-foreground/50'>/100</span>
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                         <div className="p-3 bg-black/20 rounded-lg">
                            <p className="text-lg font-semibold">{workLifeBalance.predictedHoursPerWeek} hrs</p>
                            <p className="text-xs text-muted-foreground">Predicted Weekly Hours</p>
                        </div>
                        <div className="p-3 bg-black/20 rounded-lg">
                            <p className="text-lg font-semibold">{workLifeBalance.flexibility}</p>
                            <p className="text-xs text-muted-foreground">Flexibility</p>
                        </div>
                    </div>
                    <div>
                       <h4 className='font-semibold mb-2'>Basis for Prediction</h4>
                       <p className='text-sm text-muted-foreground'>{workLifeBalance.explanation}</p>
                    </div>
                </CardContent>
            </Card>
        )}
        
        {networking && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <Users size={20} /> Networking Opportunity Finder
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className='font-semibold mb-3 flex items-center gap-2'><Calendar size={16} /> Relevant Events</h4>
                         <div className="space-y-3">
                            {networking.relevantEvents.map((event, i) => (
                                <div key={i} className="p-3 bg-black/20 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className='font-semibold'>{event.name}</p>
                                        <p className='text-xs text-muted-foreground'>{event.date} - {event.location}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild><Link href={event.url} target="_blank"><LinkIcon size={14} /></Link></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h4 className='font-semibold mb-3 flex items-center gap-2'><Users size={16} /> Potential Contacts</h4>
                         <div className="space-y-3">
                            {networking.potentialContacts.map((contact, i) => (
                                <div key={i} className="p-3 bg-black/20 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className='font-semibold'>{contact.name}</p>
                                        <p className='text-xs text-muted-foreground'>{contact.title} at {contact.company}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild><Link href={contact.linkedInUrl} target="_blank"><LinkIcon size={14} /></Link></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h4 className='font-semibold mb-3 flex items-center gap-2'><Briefcase size={16} /> Recommended Groups</h4>
                        <div className="space-y-3">
                            {networking.recommendedGroups.map((group, i) => (
                                <div key={i} className="p-3 bg-black/20 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className='font-semibold'>{group.name}</p>
                                        <p className='text-xs text-muted-foreground'>{group.platform}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild><Link href={group.url} target="_blank"><LinkIcon size={14} /></Link></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
        
        {resumeRewrite && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <PenSquare size={20} /> AI Resume Rewriter
                    </CardTitle>
                    <CardContent className="text-sm text-muted-foreground pt-2">The AI has rewritten the resume in three different styles to target different audiences.</CardContent>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="ats" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-black/30">
                            <TabsTrigger value="ats">ATS-Friendly</TabsTrigger>
                            <TabsTrigger value="creative">Creative</TabsTrigger>
                            <TabsTrigger value="executive">Executive</TabsTrigger>
                        </TabsList>
                        <TabsContent value="ats" className="mt-4">
                            <div className="space-y-6">
                                <div>
                                    <h4 className='font-semibold mb-2'>Rewritten Summary</h4>
                                    <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{resumeRewrite.ats.rewrittenSummary}</p>
                                </div>
                                <div>
                                    <h4 className='font-semibold mb-4'>Rewritten Experience</h4>
                                    <div className="space-y-4">
                                    {resumeRewrite.ats.rewrittenExperience.map((exp, i) => (
                                        <div key={i} className="pl-4 border-l-2 border-primary/50">
                                            <p className="font-bold">{exp.title}</p>
                                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                                            <p className="text-sm mt-1 whitespace-pre-wrap">{exp.rewrittenDescription}</p>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="creative" className="mt-4">
                            <div className="space-y-6">
                                <div>
                                    <h4 className='font-semibold mb-2'>Rewritten Summary</h4>
                                    <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{resumeRewrite.creative.rewrittenSummary}</p>
                                </div>
                                <div>
                                    <h4 className='font-semibold mb-4'>Rewritten Experience</h4>
                                    <div className="space-y-4">
                                    {resumeRewrite.creative.rewrittenExperience.map((exp, i) => (
                                        <div key={i} className="pl-4 border-l-2 border-primary/50">
                                            <p className="font-bold">{exp.title}</p>
                                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                                            <p className="text-sm mt-1 whitespace-pre-wrap">{exp.rewrittenDescription}</p>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="executive" className="mt-4">
                            <div className="space-y-6">
                                <div>
                                    <h4 className='font-semibold mb-2'>Rewritten Summary</h4>
                                    <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{resumeRewrite.executive.rewrittenSummary}</p>
                                </div>
                                <div>
                                    <h4 className='font-semibold mb-4'>Rewritten Experience</h4>
                                    <div className="space-y-4">
                                    {resumeRewrite.executive.rewrittenExperience.map((exp, i) => (
                                        <div key={i} className="pl-4 border-l-2 border-primary/50">
                                            <p className="font-bold">{exp.title}</p>
                                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                                            <p className="text-sm mt-1 whitespace-pre-wrap">{exp.rewrittenDescription}</p>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        )}
        
        {countryRules && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <Globe size={20} /> Resume Rules for {countryRules.countryName}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                        {countryRules.keyRules.map((rule, i) => <li key={i}>{rule}</li>)}
                    </ul>
                </CardContent>
            </Card>
        )}
        
        {visaSponsorship && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <Ship size={20} /> Visa Sponsorship Readiness
                    </CardTitle>
                </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="text-center p-6 rounded-lg bg-black/20 flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground">Sponsorship Likelihood Score</p>
                        <p className={cn("text-5xl font-bold tracking-tight my-2", getScoreStyling(visaSponsorship.readinessScore).color)}>
                            {visaSponsorship.readinessScore}<span className='text-3xl text-foreground/50'>/100</span>
                        </p>
                    </div>
                    <div>
                       <h4 className='font-semibold mb-2'>Explanation</h4>
                       <p className='text-sm text-muted-foreground'>{visaSponsorship.explanation}</p>
                    </div>
                </CardContent>
            </Card>
        )}
        
        {resumeExports && (
            <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-xl">
                        <FileJson size={20} /> Export Resume
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {resumeExports.exportFormats.map((format, i) => (
                        <div key={i} className="p-3 bg-black/20 rounded-lg flex justify-between items-center">
                            <div>
                                <p className='font-semibold'>{format.formatName}</p>
                                <p className='text-xs text-muted-foreground'>{format.description}</p>
                            </div>
                            <Button variant="ghost" size="sm" asChild><Link href={format.downloadUrl} target="_blank"><LinkIcon size={14} /> Download</Link></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )}
        
        {/* Resume Details */}
        <Card className='bg-black/20 border border-primary/20 backdrop-blur-lg shadow-lg shadow-primary/10'>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary text-xl"><User size={20} /> Extracted Resume Details</CardTitle>
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
      </div>
    </div>
  );
}
