'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { FileText, UploadCloud, Users, Loader2, Trash2, LogOut, ScanText, Languages, Star } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { FeedbackCard } from './components/feedback-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';

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
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  
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
  
  const handleHistoryClick = (candidate: AnalyzedCandidate) => {
      setSelectedCandidate(candidate);
      carouselApi?.scrollTo(0);
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
                 <Card className="bg-card/20 backdrop-blur-sm border-primary/30">
                    <CardHeader className="bg-black/30 rounded-t-lg">
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
                        <div className="pt-2 space-y-2">
                          <CardDescription>Upload a resume and job description to get instant AI-powered feedback.</CardDescription>
                           <Badge variant="outline" className="border-primary/50 text-primary/90 font-normal">
                              <Languages className="mr-2 h-4 w-4" />
                              Now with Multi-Language Support
                          </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                       <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="job-description" className='flex items-center gap-2'><FileText size={16} /> Job Description</Label>
                                <Textarea
                                    id="job-description"
                                    name="jobDescription"
                                    placeholder="Paste the job description here..."
                                    className="min-h-[150px] bg-background border-border/50"
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
            </div>
            <main className="lg:col-span-2">
                <Carousel className="w-full h-full" opts={{ loop: true }} setApi={setCarouselApi}>
                    <CarouselContent>
                        <CarouselItem>
                            {renderContent()}
                        </CarouselItem>
                        <CarouselItem>
                             <Card className="h-full flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)] p-8 bg-card/20 backdrop-blur-md border-primary/30">
                                <CardHeader>
                                    <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit">
                                        <Star className="w-10 h-10 text-primary" />
                                    </div>
                                </CardHeader>
                                <CardContent className="w-full max-w-lg">
                                    <CardTitle className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">
                                        Feedback & Ratings
                                    </CardTitle>
                                    <CardDescription className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                                        We value your feedback. Please let us know how we can improve.
                                    </CardDescription>
                                    <FeedbackCard />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                         <CarouselItem>
                             <Card className="h-full flex flex-col text-center min-h-[calc(100vh-10rem)] p-4 sm:p-8 bg-card/20 backdrop-blur-md border-primary/30">
                                <CardHeader className='flex-row items-center justify-between pb-2 w-full'>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold"><Users size={18} /> Analysis History</CardTitle>
                                    {candidates.length > 0 && (
                                        <Button variant="ghost" size="icon" onClick={clearHistory} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                            <Trash2 size={16}/>
                                            <span className='sr-only'>Clear History</span>
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent className="w-full flex-1 overflow-hidden">
                                     <ScrollArea className="h-full pr-4">
                                    {candidates.length > 0 ? (
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
                                                       <ScanText className={cn("w-5 h-5", selectedCandidate?.id === c.id ? "text-primary-foreground" : "text-primary")} />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="font-semibold truncate">{c.candidate.name}</p>
                                                        <p className={cn("text-xs truncate", selectedCandidate?.id === c.id ? "text-primary-foreground/80" : "text-muted-foreground")}>{c.fileName}</p>
                                                    </div>
                                                    <div className={cn("font-semibold text-lg", getScoreColor(c.analysis.overallScore))}>
                                                        <span>{c.analysis.overallScore.toFixed(0)}</span>
                                                        <span className="text-sm text-muted-foreground">/100</span>
                                                    </div>
                                                </button>
                                            </li>
                                            ))}
                                        </ul>
                                        ) : (
                                        <div className='h-full flex items-center justify-center'>
                                            <p className="text-sm text-muted-foreground text-center py-10">Your analyzed candidates will appear here.</p>
                                        </div>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/50 text-white border-white/20" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/50 text-white border-white/20" />
                </Carousel>
            </main>
        </div>
    </div>
  );
}
