'use client';

import { useActionState, useState, useEffect, useRef, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { FileText, UploadCloud, Users, Loader2, Trash2, LogOut, Languages, Bot, DollarSign, Globe, Video, Clock, ArrowRight, ArrowLeft, Lightbulb, PenSquare } from 'lucide-react';
import { analyzeResume } from '@/app/actions';
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
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { redirect } from 'next/navigation';
import { PageLoader } from '@/components/ui/page-loader';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { getScoreStyling } from '@/lib/theme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/countries';
import { Separator } from '@/components/ui/separator';

function SubmitButton({ isSubmitting, step, setStep }: { isSubmitting: boolean; step: number; setStep: (step: number) => void; }) {
  const { pending } = useFormStatus();

  if (step === 1) {
    return (
      <Button type="button" onClick={() => setStep(2)} className="w-full">
          Next <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button type="submit" disabled={pending || isSubmitting} className="w-full">
      {(pending || isSubmitting) ? (
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

const initialState: {
  success: boolean;
  message: string;
  data?: AnalyzedCandidate;
  errors?: any;
} = {
  success: false,
  message: '',
};

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
  const [state, formAction] = useActionState(analyzeResume, initialState);
  const [step, setStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<AnalyzedCandidate | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null); 
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const selectedCurrency = useMemo(() => countries.find(c => c.value === selectedCountry)?.currency, [selectedCountry]);

  const reportsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/analysisReports`), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: savedReports, isLoading: isLoadingReports } = useCollection(reportsQuery);

  const candidates = useMemo((): (AnalyzedCandidate & { firestoreId: string })[] => {
    if (!savedReports) return [];
    return savedReports.map(report => {
      const data = JSON.parse(report.reportJson);
      return { ...data, firestoreId: report.id };
    });
  }, [savedReports]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect('/login');
    }
  }, [user, isUserLoading]);

  useEffect(() => {
    if (isSubmitting) {
        if (state.success && state.data && user) {
          const newCandidate = state.data;
          
          const newReport = {
            userId: user.uid,
            createdAt: serverTimestamp(),
            reportJson: JSON.stringify(newCandidate),
          };
          addDoc(collection(firestore, 'users', user.uid, 'analysisReports'), newReport);

          setSelectedCandidate(newCandidate);
          toast({
            title: "Analysis Complete",
            description: `${newCandidate.candidate.name}'s resume has been analyzed.`,
            variant: "default",
          });
          formRef.current?.reset();
          setResumeFileName('');
          setVideoFileName('');
          setStep(1);
          setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } else if (!state.success && state.message && state.message !== '') {
          toast({
            title: "Analysis Failed",
            description: state.errors?._form?.[0] || state.errors?.country?.[0] || state.message,
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
    }
  }, [state, toast, isSubmitting, user, firestore]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Simple validation for step 1 fields before showing loading state
    const jobDesc = formData.get('jobDescription') as string;
    const resumeFile = formData.get('resumeFile') as File;
    const country = formData.get('country') as string;

    if (!jobDesc || resumeFile.size === 0 || !country) {
      toast({ title: "Please complete all required fields.", description: "Job Description, Resume, and Country are required to proceed.", variant: "destructive" });
      setStep(1);
      return;
    }
    
    setSelectedCandidate(null);
    setIsSubmitting(true);
    formAction(formData);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };
  
  const clearHistory = () => {
    if(!user || !firestore) return;

    candidates.forEach(c => {
        deleteDoc(doc(firestore, `users/${user.uid}/analysisReports`, c.firestoreId));
    });
    
    setSelectedCandidate(null);
    toast({
        title: "History Cleared",
        description: "All candidate analyses have been removed.",
    });
  }

  const handleSignOut = async () => {
    await signOut(auth);
    toast({ title: "Signed Out" });
  };
  
  const handleHistoryClick = (candidate: AnalyzedCandidate) => {
      setSelectedCandidate(candidate);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const renderMainPanelContent = () => {
    if (isSubmitting) {
      return <AnalysisLoading />;
    }
    if (selectedCandidate) {
      return <CandidateReport data={selectedCandidate} />;
    }
    return <WelcomeSplash />;
  };

  if (isUserLoading || !user) {
    return <PageLoader />;
  }

  return (
     <div className="relative min-h-svh w-full p-4 md:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
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
                    <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
                           <div className={cn("space-y-4", step !== 1 && "hidden")}>
                                <h2 className='text-lg font-semibold text-primary'>Step 1: Core Information</h2>
                                <div className="space-y-2">
                                    <Label htmlFor="job-description" className='flex items-center gap-2'><FileText size={16} /> Job Description</Label>
                                    <Textarea id="job-description" name="jobDescription" placeholder="Paste the job description here..." className="min-h-[120px] bg-black/20 border-border/50" required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="resume-file" className='flex items-center gap-2'><UploadCloud size={16} /> Resume Upload</Label>
                                        <Input id="resume-file" name="resumeFile" type="file" onChange={(e) => setResumeFileName(e.target.files?.[0]?.name || '')} className="hidden" required accept=".pdf,.doc,.docx"/>
                                        <Button type="button" variant="outline" className="w-full bg-black/20 hover:bg-accent/50 border-border/50" onClick={(e) => (e.currentTarget.previousSibling as HTMLInputElement)?.click()}>
                                            {resumeFileName ? <span className="truncate text-primary">{resumeFileName}</span> : 'Select a resume file...'}
                                        </Button>
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
                              <h2 className='text-lg font-semibold text-primary'>Step 2: Advanced Analysis</h2>
                              
                              <div className="p-4 rounded-lg border border-border/50 bg-black/20 space-y-4">
                                <Label className='flex items-center gap-2 text-base'><Video size={18} /> AI Video Feedback <Badge variant="secondary" className="ml-2">Beta</Badge></Label>
                                <p className='text-sm text-muted-foreground'>Upload a video resume to get feedback on facial expressions, voice confidence, and more. (Optional, up to 50MB)</p>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="analyze-video" name="analyzeVideo" />
                                    <Label htmlFor="analyze-video" className='text-muted-foreground grow'>Enable Video Analysis</Label>
                                </div>
                                 <Input id="video-file" name="videoFile" type="file" onChange={(e) => setVideoFileName(e.target.files?.[0]?.name || '')} className="hidden" accept="video/*"/>
                                  <Button type="button" variant="outline" className="w-full bg-black/20 hover:bg-accent/50 border-border/50" onClick={(e) => (e.currentTarget.previousSibling as HTMLInputElement)?.click()}>
                                      {videoFileName ? <span className="truncate text-primary">{videoFileName}</span> : 'Select a video file...'}
                                  </Button>
                              </div>
                              
                               <div className="p-4 rounded-lg border border-border/50 bg-black/20 space-y-4">
                                <Label className='flex items-center gap-2 text-base'><Lightbulb size={18} /> Additional Insights</Label>
                                <p className='text-sm text-muted-foreground'>Select additional AI-powered reports to generate.</p>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="predict-salary" name="predictSalary" defaultChecked={true} />
                                    <Label htmlFor="predict-salary" className='flex items-center gap-2 text-muted-foreground grow'>
                                        <DollarSign size={16} />
                                        <span>Salary Prediction</span>
                                        {selectedCurrency && (<Badge variant="outline" className="border-primary/50 text-primary/90 font-normal ml-auto">{selectedCurrency}</Badge>)}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="predict-work-life" name="predictWorkLife" defaultChecked={true} />
                                    <Label htmlFor="predict-work-life" className='flex items-center gap-2 text-muted-foreground grow'><Clock size={16} />Work-Life Balance Predictor</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="find-networking" name="findNetworking" defaultChecked={true} />
                                    <Label htmlFor="find-networking" className='flex items-center gap-2 text-muted-foreground grow'><Users size={16} />Networking Opportunity Finder</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="rewrite-resume" name="rewriteResume" defaultChecked={true} />
                                    <Label htmlFor="rewrite-resume" className='flex items-center gap-2 text-muted-foreground grow'><PenSquare size={16} />Resume Rewriter</Label>
                                </div>
                              </div>
                           </div>
                            <Separator/>
                            <div className="pt-2 flex gap-4">
                                {step === 2 && (
                                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                )}
                                <SubmitButton isSubmitting={isSubmitting} step={step} setStep={setStep} />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20 flex flex-col">
                    <CardHeader className='flex-row items-center justify-between pb-4'>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold"><Users size={18} /> Analysis History</CardTitle>
                        {candidates.length > 0 && (
                            <Button variant="ghost" size="icon" onClick={clearHistory} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                <Trash2 size={16}/>
                                <span className='sr-only'>Clear History</span>
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="w-full flex-grow overflow-hidden">
                        <ScrollArea className="h-full pr-4 max-h-[500px]">
                        {isLoadingReports ? <div className='h-full flex items-center justify-center'><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : candidates.length > 0 ? (
                            <ul className="space-y-2">
                                {candidates.map((c) => (
                                <li key={c.id}>
                                    <button
                                        onClick={() => handleHistoryClick(c)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 group border",
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
                                </li>
                                ))}
                            </ul>
                            ) : (
                            <div className='h-full flex flex-col items-center justify-center text-center p-4'>
                                <p className="text-sm text-muted-foreground">Your analyzed candidates will appear here.</p>
                            </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <div ref={resultsRef}>
                <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20 flex flex-col overflow-hidden min-h-[500px]">
                    <CardContent className="p-0 flex-grow">
                       <div className='p-6 min-h-[500px] flex flex-col justify-center'>
                         {renderMainPanelContent()}
                       </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
