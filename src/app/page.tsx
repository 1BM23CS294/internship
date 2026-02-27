'use client';

import { useState, useEffect, useRef, useMemo, useTransition } from 'react';
import { FileText, UploadCloud, Users, Loader2, Trash2, LogOut, Languages, Bot, DollarSign, Globe, Video, Clock, ArrowRight, ArrowLeft, Lightbulb, PenSquare, Flame, Sparkles, Fingerprint, Search, TrendingDown, AlertTriangle, GitCompareArrows, School, CaseSensitive, UserCheck, UserRound, Rocket, Medal, Files, Filter, FileJson, Ship } from 'lucide-react';
import type { AnalyzedCandidate } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CandidateReport } from './components/candidate-report';
import { WelcomeSplash } from './components/welcome-splash';
import { AnalysisLoading } from './components/analysis-loading';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { redirect } from 'next/navigation';
import { PageLoader } from '@/components/ui/page-loader';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { getScoreStyling } from '@/lib/theme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/countries';
import { Separator } from '@/components/ui/separator';
import { FeatureCarousel } from './components/feature-carousel';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HowToUse } from './components/how-to-use';
import { RoadmapCard } from './components/roadmap-card';
import { FeedbackCard } from './components/feedback-card';
import { analyzeResume } from '@/app/actions';
import { useFormState, useFormStatus } from 'react-dom';


function SubmitButton({ step, setStep }: { step: number; setStep: (step: number) => void; }) {
  const { pending } = useFormStatus();

  if (step === 1) {
    return (
      <Button type="button" onClick={() => setStep(2)} className="w-full">
          Next <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Now'
      )}
    </Button>
  );
}

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

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<AnalyzedCandidate | null>(null);
  const [resumeFileNames, setResumeFileNames] = useState<string[]>([]);
  const [videoFileName, setVideoFileName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const initialState = { success: false, message: '', data: undefined, errors: undefined };
  const [formState, formAction] = useFormState(analyzeResume, initialState);
  const { pending } = useFormStatus();

  const formRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const reportsCollection = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'analysisReports');
  }, [firestore, user]);

  const reportsQuery = useMemoFirebase(() => {
    if (!reportsCollection) return null;
    return query(reportsCollection, orderBy('createdAt', 'desc'));
  }, [reportsCollection]);

  const { data: savedReports, isLoading: isLoadingReports, error: reportsError } = useCollection(reportsQuery);

  const candidates = useMemo((): (AnalyzedCandidate & { firestoreId: string; userId: string; })[] => {
    if (!savedReports) return [];
    return savedReports.map(report => {
      try {
        const data = JSON.parse(report.reportJson);
        return { ...data, firestoreId: report.id, userId: report.userId };
      } catch (e) {
        console.error("Failed to parse report from Firestore:", e);
        return null;
      }
    }).filter(Boolean) as (AnalyzedCandidate & { firestoreId: string; userId: string; })[];
  }, [savedReports]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect('/login');
    }
  }, [user, isUserLoading]);
  
  useEffect(() => {
    if (formState.success && formState.data && formState.data.length > 0) {
        setSelectedCandidate(formState.data[0]);
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        toast({ title: "Analysis Complete", description: formState.message });
        formRef.current?.reset();
        setResumeFileNames([]);
        setVideoFileName('');
        setStep(1);
    } else if (!formState.success && formState.message && !pending && formRef.current?.dataset.submitted) {
         toast({
            title: 'Analysis Failed',
            description: formState.errors?._form?.[0] || formState.message,
            variant: 'destructive',
        });
    }
  }, [formState, pending]);

  const handleDeleteReport = (reportId: string, ownerId: string) => {
    if(!user || !firestore || user.uid !== ownerId) return;

    const docRef = doc(firestore, 'users', ownerId, 'analysisReports', reportId);

    deleteDoc(docRef).catch((error) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    const deletedCandidate = candidates.find(c => c.firestoreId === reportId);
    if (selectedCandidate && deletedCandidate && selectedCandidate.id === deletedCandidate.id) {
        setSelectedCandidate(null);
    }

    toast({
        title: "Analysis Deleted",
        description: "The selected analysis has been removed.",
    });
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    toast({ title: "Signed Out" });
  };

  const handleHistoryClick = (candidate: AnalyzedCandidate) => {
      setSelectedCandidate(candidate);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const renderMainPanelContent = () => {
    if (pending) {
      return <AnalysisLoading />;
    }
    if (selectedCandidate) {
      return <CandidateReport data={selectedCandidate} />;
    }
    return <WelcomeSplash />;
  };

  if (isUserLoading) {
    return <PageLoader />;
  }

  if (!user) {
    redirect('/login');
    return <PageLoader />;
  }

  const handleFormAction = (formData: FormData) => {
    const resumeFiles = formData.getAll('resumeFile') as File[];
    if (step === 1 && (resumeFiles.length === 0 || resumeFiles[0].size === 0)) {
        toast({
            title: "Resume Required",
            description: "Please select at least one resume file to analyze.",
            variant: "destructive",
        });
        return;
    }
    if(formRef.current) formRef.current.dataset.submitted = "true";
    formAction(formData);
  }

  return (
     <div className="relative min-h-svh w-full p-4 md:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
                <div className="space-y-6">
                    <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20">
                        <CardHeader className="bg-black/20 rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <h1 className="text-xl font-bold">Intelligent Resume Analyzer</h1>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.photoURL ?? undefined} />
                                        <AvatarFallback>{getInitials(user.displayName || user.email || 'U')}</AvatarFallback>
                                    </Avatar>
                                    <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                        <LogOut size={16}/>
                                    </Button>
                                </div>
                            </div>
                            <div className="pt-2 space-y-2">
                              <CardDescription>A multi-step AI-powered analysis of your candidates.</CardDescription>
                                <Badge variant="outline" className="border-primary/50 text-primary/90 font-normal">
                                    <Languages className="mr-2 h-4 w-4" />
                                    Now with Multi-Language Support
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow pt-6">
                            <form ref={formRef} action={handleFormAction} className="space-y-4">
                                <div className={cn("space-y-4", step !== 1 && "hidden")}>
                                      <h2 className='text-lg font-semibold text-primary'>Step 1: Core Information</h2>
                                      <div className="space-y-2">
                                          <Label htmlFor="job-description" className='flex items-center gap-2'><FileText size={16} /> Job Description</Label>
                                          <Textarea id="job-description" name="jobDescription" placeholder="Paste the job description here..." className="min-h-[120px] bg-black/20 border-border/50" required />
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                              <Label htmlFor="resume-file" className='flex items-center gap-2'><UploadCloud size={16} /> Resume Upload</Label>
                                              <Input id="resume-file" name="resumeFile" type="file" multiple onChange={(e) => setResumeFileNames(e.target.files ? Array.from(e.target.files).map(f => f.name) : [])} className="hidden" accept="*/*"/>
                                              <Button type="button" variant="outline" className="w-full bg-black/20 hover:bg-accent/50 border-border/50" onClick={(e) => (e.currentTarget.previousSibling as HTMLInputElement)?.click()}>
                                                  {resumeFileNames.length > 0 ? <span className="truncate text-primary">{resumeFileNames.length} resume(s) selected</span> : 'Select resume(s)...'}
                                              </Button>
                                              <p className="text-xs text-muted-foreground text-center">Supports any resume format (PDF, DOCX, images, etc.). The AI is designed to handle diverse layouts.</p>
                                          </div>
                                          <div className="space-y-2">
                                              <Label htmlFor="country" className='flex items-center gap-2'><Globe size={16} /> Country</Label>
                                              <Select name="country" required onValueChange={setSelectedCountry}>
                                                  <SelectTrigger className="w-full bg-black/20 border-border/50"><SelectValue placeholder="Select a country..." /></SelectTrigger>
                                                  <SelectContent>{countries.map(country => (<SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>))}</SelectContent>
                                              </Select>
                                          </div>
                                      </div>
                                </div>

                                <div className={cn("space-y-6", step !== 2 && "hidden")}>
                                    <h2 className='text-lg font-semibold text-primary'>Step 2: Advanced Analysis Modules</h2>
                                    
                                     <Card className="p-4 border-border/50 bg-black/20">
                                        <CardHeader className='p-0 pb-4'>
                                             <CardTitle className='flex items-center gap-2 text-base'><CaseSensitive size={18}/> Analysis Mode</CardTitle>
                                             <CardDescription className='text-sm text-muted-foreground'>Optimize the analysis by selecting the candidate's career level. The AI will adjust its evaluation criteria accordingly.</CardDescription>
                                        </CardHeader>
                                        <CardContent className='p-0'>
                                            <RadioGroup name="analysisMode" defaultValue="normal" className="grid grid-cols-3 gap-4">
                                                <div><RadioGroupItem value="normal" id="mode-normal" className="peer sr-only" /><Label htmlFor="mode-normal" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"><UserRound className="mb-3 h-6 w-6" />Normal</Label></div>
                                                <div><RadioGroupItem value="fresher" id="mode-fresher" className="peer sr-only" /><Label htmlFor="mode-fresher" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"><School className="mb-3 h-6 w-6" />Fresher</Label></div>
                                                <div><RadioGroupItem value="executive" id="mode-executive" className="peer sr-only" /><Label htmlFor="mode-executive" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"><UserCheck className="mb-3 h-6 w-6" />Executive</Label></div>
                                            </RadioGroup>
                                        </CardContent>
                                    </Card>

                                    <Card className="p-4 border-border/50 bg-black/20">
                                        <CardHeader className='p-0 pb-4'>
                                            <CardTitle className='flex items-center gap-2 text-base'><Lightbulb size={18} /> Standard Modules</CardTitle>
                                        </CardHeader>
                                        <CardContent className='p-0 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <div className="flex items-center space-x-2"><Checkbox id="predict-salary" name="predictSalary" defaultChecked={true} /><Label htmlFor="predict-salary" className='text-muted-foreground'>Salary Prediction</Label></div>
                                            <div className="flex items-center space-x-2"><Checkbox id="predict-work-life" name="predictWorkLife" defaultChecked={true} /><Label htmlFor="predict-work-life" className='text-muted-foreground'>Work-Life Balance</Label></div>
                                            <div className="flex items-center space-x-2"><Checkbox id="find-networking" name="findNetworking" defaultChecked={true} /><Label htmlFor="find-networking" className='text-muted-foreground'>Networking Finder</Label></div>
                                            <div className="flex items-center space-x-2"><Checkbox id="rewrite-resume" name="rewriteResume" defaultChecked={true} /><Label htmlFor="rewrite-resume" className='text-muted-foreground'>AI Resume Rewriter</Label></div>
                                            <div className="col-span-full space-y-2 pt-2"><Label className='flex items-center gap-2 text-base'><Video size={18} /> AI Video Feedback <Badge variant="secondary" className="ml-2">Optional</Badge></Label><div className="flex items-center space-x-2"><Checkbox id="analyze-video" name="analyzeVideo" /><Label htmlFor="analyze-video" className='text-muted-foreground grow'>Enable Video Analysis (up to 50MB)</Label></div><Input id="video-file" name="videoFile" type="file" onChange={(e) => setVideoFileName(e.target.files?.[0]?.name || '')} className="hidden" accept="video/*"/><Button type="button" variant="outline" className="w-full bg-black/20 hover:bg-accent/50 border-border/50" onClick={(e) => (e.currentTarget.previousSibling as HTMLInputElement)?.click()}>{videoFileName ? <span className="truncate text-primary">{videoFileName}</span> : 'Select a video file...'}</Button></div>
                                        </CardContent>
                                    </Card>

                                    <Card className="p-4 border-border/50 bg-black/20">
                                        <CardHeader className='p-0 pb-4'>
                                            <CardTitle className='flex items-center gap-2 text-base'><Sparkles size={18}/> New Analysis Modules</CardTitle>
                                        </CardHeader>
                                        <CardContent className='p-0 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                             <div className="flex items-center space-x-2"><Checkbox id="roast-resume" name="roastResume" defaultChecked={true} /><Label htmlFor="roast-resume" className='flex items-center gap-2 text-muted-foreground'><Flame size={16}/>Resume Roast</Label></div>
                                             <div className="flex items-center space-x-2"><Checkbox id="confidence-booster" name="confidenceBooster" defaultChecked={true} /><Label htmlFor="confidence-booster" className='flex items-center gap-2 text-muted-foreground'><Sparkles size={16}/>Confidence Booster</Label></div>
                                             <div className="flex items-center space-x-2"><Checkbox id="personal-brand-check" name="personalBrandCheck" defaultChecked={true} /><Label htmlFor="personal-brand-check" className='flex items-center gap-2 text-muted-foreground'><Fingerprint size={16}/>Personal Brand Check</Label></div>
                                             <div className="flex items-center space-x-2"><Checkbox id="hidden-strength-discovery" name="hiddenStrengthDiscovery" defaultChecked={true} /><Label htmlFor="hidden-strength-discovery" className='flex items-center gap-2 text-muted-foreground'><Search size={16}/>Hidden Strength Discovery</Label></div>
                                             <div className="flex items-center space-x-2"><Checkbox id="career-risk-assessment" name="careerRiskAssessment" defaultChecked={true} /><Label htmlFor="career-risk-assessment" className='flex items-center gap-2 text-muted-foreground'><TrendingDown size={16}/>Career Risk Assessment</Label></div>
                                             <div className="flex items-center space-x-2"><Checkbox id="skill-obsolescence-warning" name="skillObsolescenceWarning" defaultChecked={true} /><Label htmlFor="skill-obsolescence-warning" className='flex items-center gap-2 text-muted-foreground'><AlertTriangle size={16}/>Skill Obsolescence Warning</Label></div>
                                             <div className="flex items-center space-x-2"><Checkbox id="resume-version-control" name="resumeVersionControl" defaultChecked={true} /><Label htmlFor="resume-version-control" className='flex items-center gap-2 text-muted-foreground'><GitCompareArrows size={16}/>AI Resume Versioning</Label></div>
                                             <div className="flex items-center space-x-2"><Checkbox id="internship-readiness" name="internshipReadiness" defaultChecked={true} /><Label htmlFor="internship-readiness" className='flex items-center gap-2 text-muted-foreground'><School size={16}/>Internship Readiness Score</Label></div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="p-4 border-border/50 bg-black/20">
                                        <CardHeader className='p-0 pb-4'>
                                            <CardTitle className='flex items-center gap-2 text-base'><Rocket size={18}/> Enterprise Modules</CardTitle>
                                        </CardHeader>
                                        <CardContent className='p-0 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <div className="flex items-center space-x-2"><Checkbox id="candidate-ranking" name="candidateRanking" defaultChecked={true} /><Label htmlFor="candidate-ranking" className='flex items-center gap-2 text-muted-foreground'><Medal size={16}/>Candidate Ranking</Label></div>
                                            <div className="flex items-center space-x-2"><Checkbox id="team-benchmarking" name="teamBenchmarking" defaultChecked={true} /><Label htmlFor="team-benchmarking" className='flex items-center gap-2 text-muted-foreground'><Users size={16}/>Team Benchmarking</Label></div>
                                            <div className="flex items-center space-x-2"><Checkbox id="hiring-funnel-insights" name="hiringFunnelInsights" defaultChecked={true} /><Label htmlFor="hiring-funnel-insights" className='flex items-center gap-2 text-muted-foreground'><Filter size={16}/>Hiring Funnel Insights</Label></div>
                                        </CardContent>
                                    </Card>

                                    <Card className="p-4 border-border/50 bg-black/20">
                                        <CardHeader className='p-0 pb-4'>
                                            <CardTitle className='flex items-center gap-2 text-base'><Globe size={18}/> International & Export Features</CardTitle>
                                        </CardHeader>
                                        <CardContent className='p-0 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <div className="flex items-center space-x-2"><Checkbox id="country-specific-rules" name="countrySpecificRules" defaultChecked={true} /><Label htmlFor="country-specific-rules" className='flex items-center gap-2 text-muted-foreground'><Globe size={16}/>Country-Specific Rules</Label></div>
                                            <div className="flex items-center space-x-2"><Checkbox id="visa-readiness" name="visaReadiness" defaultChecked={true} /><Label htmlFor="visa-readiness" className='flex items-center gap-2 text-muted-foreground'><Ship size={16}/>Visa Sponsorship Readiness</Label></div>
                                            <div className="flex items-center space-x-2"><Checkbox id="export-formats" name="exportFormats" defaultChecked={true} /><Label htmlFor="export-formats" className='flex items-center gap-2 text-muted-foreground'><FileJson size={16}/>Resume Export Formats</Label></div>
                                        </CardContent>
                                    </Card>
                                </div>

                                  <Separator/>
                                  <div className="pt-2 flex gap-4">
                                      {step === 2 && (
                                          <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">
                                              <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                          </Button>
                                      )}
                                      <SubmitButton step={step} setStep={setStep} />
                                  </div>
                            </form>
                        </CardContent>
                    </Card>
                    <div ref={resultsRef} className="mt-6">
                        <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20 flex flex-col overflow-hidden min-h-[500px]">
                            <CardContent className="p-0 flex-grow">
                               <div className='p-6 min-h-[500px] flex flex-col justify-center'>
                                 {renderMainPanelContent()}
                               </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20 flex flex-col">
                    <CardHeader className='flex-row items-center justify-between pb-4'>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold"><Users size={18} /> Analysis History</CardTitle>
                    </CardHeader>
                    <CardContent className="w-full flex-grow overflow-hidden">
                        <ScrollArea className="h-full pr-4 max-h-[calc(100vh-180px)]">
                        {isLoadingReports ? <div className='h-full flex items-center justify-center'><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : reportsError ? (
                            <div className='h-full flex flex-col items-center justify-center text-center p-4 text-destructive'>
                                <p className="text-sm font-semibold">Error Loading History</p>
                                <p className="text-xs break-words">{reportsError.message}</p>
                            </div>
                        ) : candidates.length > 0 ? (
                            <ul className="space-y-2">
                                {candidates.map((c) => (
                                <li key={c.id}>
                                    <div className="relative group/item">
                                        <button
                                            onClick={() => handleHistoryClick(c)}
                                            className={cn(
                                                "w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 border",
                                                selectedCandidate?.id === c.id ? "bg-primary/90 text-primary-foreground border-primary" : "hover:bg-muted/50 border-border"
                                            )}>
                                            <div className="p-2 bg-muted rounded-md">
                                            <Bot className={cn("w-5 h-5", selectedCandidate?.id === c.id ? "text-primary-foreground" : "text-primary")} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-semibold truncate">{c.candidate.name}</p>
                                                <p className={cn("text-xs truncate", selectedCandidate?.id === c.id ? "text-primary-foreground/80" : "text-muted-foreground")}>{c.fileName}</p>
                                            </div>
                                            <div className={cn("font-semibold text-lg", getScoreStyling(c.analysis.overallScore).color)}>
                                                <span>{c.analysis.overallScore.toFixed(0)}</span>
                                                <span className="text-sm text-muted-foreground">/100</span>
                                            </div>
                                        </button>
                                        {(user && c.userId === user.uid) && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteReport(c.firestoreId, c.userId)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100"
                                            >
                                                <Trash2 size={16}/>
                                                <span className='sr-only'>Delete Report</span>
                                            </Button>
                                        )}
                                    </div>
                                </li>
                                ))}
                            </ul>
                            ) : (
                            <div className='h-full flex flex-col items-center justify-center text-center p-4'>
                                <p className="text-sm text-muted-foreground">Your past analyses will appear here.</p>
                            </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            
            <div className="space-y-6">
              <FeatureCarousel />
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <HowToUse />
                    </div>
                    <div className="space-y-6">
                        <RoadmapCard />
                        <FeedbackCard />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
