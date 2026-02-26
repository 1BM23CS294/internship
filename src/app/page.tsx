'use client';

import { useActionState, useState, useEffect, useRef, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { FileText, UploadCloud, Users, Loader2, Trash2, LogOut, Languages, Bot, DollarSign } from 'lucide-react';
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
import { FeedbackCard } from './components/feedback-card';
import { getScoreStyling } from '@/lib/theme';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Resume'
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
  const [selectedCandidate, setSelectedCandidate] = useState<AnalyzedCandidate | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null); // For scrolling to results
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

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
          setFileName('');
          setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } else if (!state.success && state.message && state.message !== '') {
          toast({
            title: "Analysis Failed",
            description: state.errors?._form?.[0] || state.message,
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
    }
  }, [state, toast, isSubmitting, user, firestore]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobDesc = formData.get('jobDescription') as string;
    const resume = formData.get('resumeFile') as File;

    if (!jobDesc || !resume || resume.size === 0) {
        if (!jobDesc) {
            toast({ title: "Job Description is required.", variant: "destructive" });
        }
        if (!resume || resume.size === 0) {
            toast({ title: "Resume file is required.", variant: "destructive" });
        }
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <CardDescription>Upload a resume and job description to get instant AI-powered feedback.</CardDescription>
                        <Badge variant="outline" className="border-primary/50 text-primary/90 font-normal">
                            <Languages className="mr-2 h-4 w-4" />
                            Now with Multi-Language Support
                        </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow pt-6">
                    <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="job-description" className='flex items-center gap-2'><FileText size={16} /> Job Description</Label>
                                <Textarea
                                    id="job-description"
                                    name="jobDescription"
                                    placeholder="Paste the job description here..."
                                    className="min-h-[150px] bg-black/20 border-border/50"
                                    required
                                />
                                {state.errors?.jobDescription && <p className="text-red-500 text-sm mt-1">{state.errors.jobDescription[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="resume-file" className='flex items-center gap-2'><UploadCloud size={16} /> Resume Upload</Label>
                                <Input id="resume-file" name="resumeFile" type="file" ref={fileInputRef} onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} className="hidden" required accept=".pdf,.doc,.docx"/>
                                <Button type="button" variant="outline" className="w-full bg-black/20 hover:bg-accent/50 border-border/50" onClick={() => fileInputRef.current?.click()}>
                                    {fileName ? <span className="truncate text-primary">{fileName}</span> : 'Select a file (PDF, DOCX)'}
                                </Button>
                                {state.errors?.resumeFile && <p className="text-red-500 text-sm mt-1">{state.errors.resumeFile[0]}</p>}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="predict-salary" name="predictSalary" defaultChecked={true} />
                                <Label htmlFor="predict-salary" className='flex items-center gap-2 text-muted-foreground'>
                                    <DollarSign size={16} />
                                    Include Salary Prediction
                                </Label>
                            </div>
                            <div className="pt-2">
                                <SubmitButton />
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
                        <ScrollArea className="h-[438px] pr-4">
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
                            <div className='h-full flex flex-col items-center justify-center text-center'>
                                <p className="text-sm text-muted-foreground">Your analyzed candidates will appear here.</p>
                            </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <div ref={resultsRef}>
                <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20 flex flex-col overflow-hidden">
                    <CardContent className="p-0 flex-grow">
                        <ScrollArea className="h-full w-full">
                           <div className='p-6 min-h-[500px] flex flex-col justify-center'>
                             {renderMainPanelContent()}
                           </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <FeedbackCard />
        </div>
    </div>
  );
}
