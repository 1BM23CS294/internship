'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { FileText, UploadCloud, Users, Loader2, Trash2, LogOut, ScanText } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, useUser } from '@/firebase';
import { redirect } from 'next/navigation';
import { PageLoader } from '@/components/ui/page-loader';
import { signOut } from 'firebase/auth';
import { Logo } from '@/components/logo';
import { Separator } from '@/components/ui/separator';

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

const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
};

export default function Home() {
  const [state, formAction] = useActionState(analyzeResume, initialState);
  const [candidates, setCandidates] = useState<AnalyzedCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<AnalyzedCandidate | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect('/login');
    }
  }, [user, isUserLoading]);

  useEffect(() => {
    if (user) {
      const savedCandidates = localStorage.getItem(`analyzedCandidates_${user.uid}`);
      if (savedCandidates) {
        try {
          const parsedCandidates = JSON.parse(savedCandidates);
          if (Array.isArray(parsedCandidates)) {
            setCandidates(parsedCandidates);
          }
        } catch (error) {
          console.error("Failed to parse candidates from localStorage:", error);
        }
      } else {
        setCandidates([]);
      }
      setSelectedCandidate(null);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`analyzedCandidates_${user.uid}`, JSON.stringify(candidates));
    }
  }, [candidates, user]);

  useEffect(() => {
    if (isSubmitting) {
        if (state.success && state.data) {
          const newCandidate = state.data;
          setCandidates(prev => [newCandidate, ...prev]);
          setSelectedCandidate(newCandidate);
          toast({
            title: "Analysis Complete",
            description: `${newCandidate.candidate.name}'s resume has been analyzed.`,
            variant: "default",
          });
          formRef.current?.reset();
          setFileName('');
        } else if (!state.success && state.message && state.message !== '') {
          toast({
            title: "Analysis Failed",
            description: state.errors?._form?.[0] || state.message,
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
    }
  }, [state, toast, isSubmitting]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobDesc = formData.get('jobDescription') as string;
    const resume = formData.get('resumeFile') as File;
    if (jobDesc && resume?.size > 0) {
      setIsSubmitting(true);
      setSelectedCandidate(null);
      formAction(formData);
    } else {
       // Handle client-side validation failure if needed
        if (!jobDesc) {
            toast({ title: "Job Description is required.", variant: "destructive" });
        }
        if (!resume || resume.size === 0) {
            toast({ title: "Resume file is required.", variant: "destructive" });
        }
    }
  };
  
  const clearHistory = () => {
    setCandidates([]);
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

  const renderContent = () => {
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
     <div className="min-h-svh w-full p-4 md:p-6 lg:p-8">
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className="lg:col-span-1 space-y-8">
                 <Card className="bg-card/50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Logo />
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
                         <CardDescription>Upload a resume and job description to get instant AI-powered feedback.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="job-description" className='flex items-center gap-2'><FileText size={16} /> Job Description</Label>
                                <Textarea
                                    id="job-description"
                                    name="jobDescription"
                                    placeholder="Paste the job description here..."
                                    className="min-h-[150px] text-sm bg-background border-border/50"
                                    required
                                />
                                {state.errors?.jobDescription && <p className="text-red-500 text-sm mt-1">{state.errors.jobDescription[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="resume-file" className='flex items-center gap-2'><UploadCloud size={16} /> Resume Upload</Label>
                                <Input id="resume-file" name="resumeFile" type="file" ref={fileInputRef} onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} className="hidden" required accept=".pdf,.doc,.docx"/>
                                <Button type="button" variant="outline" className="w-full bg-background hover:bg-accent/50 border-border/50" onClick={() => fileInputRef.current?.click()}>
                                    {fileName ? <span className="truncate text-primary">{fileName}</span> : 'Select a file (PDF, DOCX)'}
                                </Button>
                                {state.errors?.resumeFile && <p className="text-red-500 text-sm mt-1">{state.errors.resumeFile[0]}</p>}
                            </div>
                            <div className="pt-2">
                                <SubmitButton />
                            </div>
                        </form>
                    </CardContent>
                 </Card>
                 <Card className="bg-card/50">
                    <CardHeader className='flex-row items-center justify-between pb-2'>
                        <CardTitle className="flex items-center gap-2 text-base font-medium"><Users size={18} /> Analysis History</CardTitle>
                        {candidates.length > 0 && (
                            <Button variant="ghost" size="icon" onClick={clearHistory} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                <Trash2 size={16}/>
                                <span className='sr-only'>Clear History</span>
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-64">
                        {candidates.length > 0 ? (
                            <ul className="space-y-2">
                                {candidates.map((c) => (
                                <li key={c.id}>
                                    <button
                                        onClick={() => setSelectedCandidate(c)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 group border",
                                            selectedCandidate?.id === c.id ? "bg-primary/90 text-primary-foreground border-primary" : "hover:bg-muted/50 border-border"
                                        )}>
                                        <div className="p-2 bg-muted rounded-md">
                                           <ScanText className={cn("w-5 h-5", selectedCandidate?.id === c.id ? "text-primary-foreground" : "text-primary")} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-semibold truncate">{c.candidate.name}</p>
                                            <p className={cn("text-xs truncate", selectedCandidate?.id === c.id ? "text-primary-foreground/80" : "text-muted-foreground")}>{c.fileName}</p>
                                        </div>
                                        <div className={cn("font-semibold text-lg", getScoreColor(c.analysis.overallScore))}>
                                            <span>{c.analysis.overallScore.toFixed(0)}</span>
                                            <span className="text-sm text-muted-foreground">/10</span>
                                        </div>
                                    </button>
                                </li>
                                ))}
                            </ul>
                            ) : (
                            <p className="text-sm text-muted-foreground text-center py-10">Your analyzed candidates will appear here.</p>
                            )}
                        </ScrollArea>
                    </CardContent>
                 </Card>
            </div>
            <main className="lg:col-span-2">
                {renderContent()}
            </main>
        </div>
    </div>
  );
}
