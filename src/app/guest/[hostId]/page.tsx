'use client';

import { useState, useEffect, useMemo } from 'react';
import type { AnalyzedCandidate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CandidateReport } from '@/app/components/candidate-report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { redirect } from 'next/navigation';
import { PageLoader } from '@/components/ui/page-loader';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Bot, Loader2, LogOut, Users } from 'lucide-react';
import { getScoreStyling } from '@/lib/theme';
import Link from 'next/link';

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

export default function GuestPage({ params }: { params: { hostId: string } }) {
  const { hostId } = params;
  const [selectedCandidate, setSelectedCandidate] = useState<AnalyzedCandidate | null>(null);

  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  // Get host user's data
  const hostDocRef = useMemoFirebase(() => {
    if (!hostId || !firestore) return null;
    return doc(firestore, 'users', hostId);
  }, [hostId, firestore]);

  const { data: hostData, isLoading: isHostLoading, error: hostError } = useDoc(hostDocRef);

  // Get host user's reports
  const reportsCollection = useMemoFirebase(() => {
    if (!hostId || !firestore) return null;
    return collection(firestore, 'users', hostId, 'analysisReports');
  }, [hostId, firestore]);

  const reportsQuery = useMemoFirebase(() => {
    if (!reportsCollection) return null;
    return query(reportsCollection, orderBy('createdAt', 'desc'));
  }, [reportsCollection]);

  const { data: savedReports, isLoading: isLoadingReports, error: reportsError } = useCollection(reportsQuery);

  const candidates = useMemo((): (AnalyzedCandidate & { firestoreId: string; })[] => {
    if (!savedReports) return [];
    return savedReports.map(report => {
      try {
        const data = JSON.parse(report.reportJson);
        return { ...data, firestoreId: report.id };
      } catch (e) {
        console.error("Failed to parse report from Firestore:", e);
        return null;
      }
    }).filter(Boolean) as (AnalyzedCandidate & { firestoreId: string; })[];
  }, [savedReports]);
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect('/login');
    }
  }, [user, isUserLoading]);
  
  useEffect(() => {
    if(reportsError) {
        toast({
            title: "Access Denied",
            description: "You do not have permission to view this dashboard. Please ask the owner to grant you guest access.",
            variant: "destructive"
        })
    }
  }, [reportsError, toast]);

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    toast({ title: "Signed Out" });
  };
  
  if (isUserLoading || isHostLoading) {
    return <PageLoader />;
  }

  if (!user) {
    redirect('/login');
    return <PageLoader />;
  }
  
  const hostName = hostData?.displayName || (hostData?.firstName && hostData?.lastName ? `${hostData.firstName} ${hostData.lastName}`: 'Host');

  return (
     <div className="relative min-h-svh w-full p-4 md:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto space-y-8">
            <header className="flex items-center justify-between p-4 rounded-lg bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20">
                <div className='flex items-center gap-3'>
                    <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage src={hostData?.photoURL ?? undefined} />
                        <AvatarFallback>{getInitials(hostName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className='text-sm text-muted-foreground'>Viewing Dashboard Of</p>
                        <h1 className="text-xl font-bold">{hostName}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild className="hidden sm:flex"><Link href="/">My Dashboard</Link></Button>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL ?? undefined} />
                        <AvatarFallback>{getInitials(user.displayName || user.email || 'U')}</AvatarFallback>
                    </Avatar>
                    <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <LogOut size={16}/>
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                     <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20 flex flex-col overflow-hidden min-h-[500px]">
                        <CardContent className="p-0 flex-grow">
                            <div className='p-6 min-h-[500px] flex flex-col justify-center'>
                               {selectedCandidate ? (
                                    <CandidateReport data={selectedCandidate} />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <p className="text-lg text-muted-foreground">Select a report from the history to view details.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                    <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20 flex flex-col">
                        <CardHeader className='flex-row items-center justify-between pb-4'>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold"><Users size={18} /> Analysis History</CardTitle>
                        </CardHeader>
                        <CardContent className="w-full flex-grow overflow-hidden">
                            <ScrollArea className="h-full pr-4 max-h-[calc(100vh-180px)]">
                            {isLoadingReports ? <div className='h-full flex items-center justify-center'><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (reportsError || hostError) ? (
                                <div className='h-full flex flex-col items-center justify-center text-center p-4 text-destructive'>
                                    <p className="text-sm font-semibold">Access Denied</p>
                                    <p className="text-xs">You do not have permission to view this dashboard.</p>
                                </div>
                            ) : candidates.length > 0 ? (
                                <ul className="space-y-2">
                                    {candidates.map((c) => (
                                    <li key={c.firestoreId}>
                                        <button
                                            onClick={() => setSelectedCandidate(c)}
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
                                    </li>
                                    ))}
                                </ul>
                                ) : (
                                <div className='h-full flex flex-col items-center justify-center text-center p-4'>
                                    <p className="text-sm text-muted-foreground">{hostName} has no analysis reports yet.</p>
                                </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
