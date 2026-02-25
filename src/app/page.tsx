'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { FileText, UploadCloud, Users, Loader2, Trash2 } from 'lucide-react';
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
import { Header } from './components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { CircularProgress } from './components/circular-progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


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
  const [candidates, setCandidates] = useState<AnalyzedCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<AnalyzedCandidate | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load candidates from localStorage on initial client render
  useEffect(() => {
    if (isClient) {
      const savedCandidates = localStorage.getItem('analyzedCandidates');
      if (savedCandidates) {
        try {
          const parsedCandidates = JSON.parse(savedCandidates);
          if (Array.isArray(parsedCandidates)) {
            setCandidates(parsedCandidates);
          }
        } catch (error) {
          console.error("Failed to parse candidates from localStorage:", error);
        }
      }
    }
  }, [isClient]);

  // Save candidates to localStorage whenever the list changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('analyzedCandidates', JSON.stringify(candidates));
    }
  }, [candidates, isClient]);


  useEffect(() => {
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
    setIsLoading(false);
  }, [state, toast]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const jobDesc = formData.get('jobDescription') as string;
    const resume = formData.get('resumeFile') as File;
    if (jobDesc && resume?.size > 0) {
      setIsLoading(true);
      setSelectedCandidate(null);
    }
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

  const renderContent = () => {
    if (isLoading) {
      return <AnalysisLoading />;
    }
    if (selectedCandidate) {
      return <CandidateReport data={selectedCandidate} />;
    }
    return <WelcomeSplash />;
  };

  return (
     <SidebarProvider style={{ '--sidebar-width': '380px' } as React.CSSProperties}>
      <Sidebar>
        <div className="flex flex-col h-full bg-sidebar/80 backdrop-blur-xl border-r border-border/20">
            <form ref={formRef} action={formAction} onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-y-auto">
                <div className="p-4 space-y-6 flex-1">
                <Card className='bg-transparent border-border/30'>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText size={18} /> Job Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Label htmlFor="job-description" className="sr-only">Job Description</Label>
                    <Textarea
                        id="job-description"
                        name="jobDescription"
                        placeholder="Paste the job description here..."
                        className="min-h-[200px] text-sm bg-background/50 border-border/50"
                        required
                    />
                    {state.errors?.jobDescription && <p className="text-red-500 text-sm mt-1">{state.errors.jobDescription[0]}</p>}
                    </CardContent>
                </Card>

                <Card className='bg-transparent border-border/30'>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UploadCloud size={18} /> Resume Upload</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Label htmlFor="resume-file" className="sr-only">Resume</Label>
                    <Input id="resume-file" name="resumeFile" type="file" ref={fileInputRef} onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} className="hidden" required/>
                        <Button type="button" variant="outline" className="w-full bg-transparent hover:bg-accent/50 border-border/50" onClick={() => fileInputRef.current?.click()}>
                        {fileName ? <span className="truncate">{fileName}</span> : 'Select a file (PDF, DOCX)'}
                        </Button>
                    {state.errors?.resumeFile && <p className="text-red-500 text-sm mt-1">{state.errors.resumeFile[0]}</p>}
                    </CardContent>
                </Card>
                </div>
                <div className="p-4 border-t border-border/30 mt-auto sticky bottom-0 bg-sidebar/80 backdrop-blur-xl">
                <SubmitButton />
                </div>
            </form>

            <div className="border-t border-border/30 flex-shrink-0">
                <CardHeader className='flex-row items-center justify-between'>
                    <CardTitle className="flex items-center gap-2"><Users size={18} /> Candidates</CardTitle>
                    {candidates.length > 0 && (
                        <Button variant="ghost" size="icon" onClick={clearHistory} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                            <Trash2 size={16}/>
                            <span className='sr-only'>Clear History</span>
                        </Button>
                    )}
                </CardHeader>
                <ScrollArea className="h-48 px-4 pb-4">
                {candidates.length > 0 ? (
                    <ul className="space-y-2">
                        {candidates.map((c) => (
                        <li key={c.id}>
                            <button
                                onClick={() => setSelectedCandidate(c)}
                                className={cn(
                                    "w-full text-left p-2 rounded-lg transition-colors flex items-center gap-3 group",
                                    selectedCandidate?.id === c.id ? "bg-primary/90 text-primary-foreground" : "hover:bg-accent/50"
                                )}>
                                <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary/20">
                                     <AvatarFallback className={cn("text-sm", selectedCandidate?.id === c.id ? "bg-primary-foreground text-primary" : "bg-muted/80")}>
                                        {getInitials(c.candidate.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-semibold truncate">{c.candidate.name}</p>
                                    <p className={cn("text-xs truncate", selectedCandidate?.id === c.id ? "text-primary-foreground/80" : "text-muted-foreground")}>{c.fileName}</p>
                                </div>
                                <CircularProgress value={c.matchScore.matchScore} size={36} strokeWidth={4} />
                            </button>
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Your analyzed candidates will appear here.</p>
                    )}
                </ScrollArea>
            </div>
        </div>
      </Sidebar>
      <SidebarInset className='bg-transparent'>
        <Header />
        <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-6 lg:p-8">
            {renderContent()}
            </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
