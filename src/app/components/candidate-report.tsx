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
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CircularProgress } from './circular-progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getScoreStyling } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  const { candidate, analysis, recommendations, salaryPrediction, personalityProfile, videoAnalysis, workLifeBalance, networking } = data;
  const performanceMetrics = analysis.performanceMetrics;
  
  const activeTabs = [
    'overview', 'performance', 'recommendations',
    videoAnalysis ? 'video' : null,
    salaryPrediction ? 'salary' : null,
    personalityProfile ? 'personality' : null,
    workLifeBalance ? 'worklife' : null,
    networking ? 'networking' : null,
    'details'
  ].filter(Boolean) as string[];

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
        <Tabs defaultValue="overview" className="w-full" activationMode='manual'>
            <TabsList className={cn("grid w-full bg-black/20")} style={{ gridTemplateColumns: `repeat(${activeTabs.length}, minmax(0, 1fr))`}}>
                {activeTabs.includes('overview') && <TabsTrigger value="overview">Overview</TabsTrigger>}
                {activeTabs.includes('performance') && <TabsTrigger value="performance">Performance</TabsTrigger>}
                {activeTabs.includes('recommendations') && <TabsTrigger value="recommendations">AI Insights</TabsTrigger>}
                {activeTabs.includes('video') && <TabsTrigger value="video">Video</TabsTrigger>}
                {activeTabs.includes('salary') && <TabsTrigger value="salary">Salary</TabsTrigger>}
                {activeTabs.includes('personality') && <TabsTrigger value="personality">Personality</TabsTrigger>}
                {activeTabs.includes('worklife') && <TabsTrigger value="worklife">Work-Life</TabsTrigger>}
                {activeTabs.includes('networking') && <TabsTrigger value="networking">Networking</TabsTrigger>}
                {activeTabs.includes('details') && <TabsTrigger value="details">Resume Details</TabsTrigger>}
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

            {videoAnalysis && <TabsContent value="video" className='mt-6'>
                <Card className='bg-black/20 border border-primary/20'>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
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
            </TabsContent>}

             {salaryPrediction && <TabsContent value="salary" className="mt-6">
                <Card className='bg-black/20 border border-primary/20'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
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
            </TabsContent>}

            {personalityProfile && <TabsContent value="personality" className="mt-6">
                <Card className='bg-black/20 border border-primary/20'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
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
            </TabsContent>}

             {workLifeBalance && <TabsContent value="worklife" className="mt-6">
                <Card className='bg-black/20 border border-primary/20'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
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
            </TabsContent>}

            {networking && <TabsContent value="networking" className="mt-6">
                <Card className='bg-black/20 border border-primary/20'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
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
            </TabsContent>}

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
