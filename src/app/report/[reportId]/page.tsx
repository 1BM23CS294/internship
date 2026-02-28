'use client';
import { useState, useEffect } from 'react';
import type { AnalyzedCandidate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';
import { PrintableReport } from '@/app/components/printable-report';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function ReportPage({ params }: { params: { reportId: string } }) {
    const { reportId } = params;
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const [reportData, setReportData] = useState<AnalyzedCandidate | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const reportDocRef = useMemoFirebase(() => {
        if (!user || !firestore || !reportId) return null;
        return doc(firestore, 'users', user.uid, 'analysisReports', reportId);
    }, [firestore, user, reportId]);

    const { data: reportDocFromHook, isLoading: isReportLoading, error: reportError } = useDoc(reportDocRef);

    useEffect(() => {
        // Prioritize data from sessionStorage
        const sessionDataString = sessionStorage.getItem(`report-data-${reportId}`);
        if (sessionDataString) {
            try {
                const sessionData = JSON.parse(sessionDataString);
                setReportData(sessionData);
                setIsLoading(false);
                sessionStorage.removeItem(`report-data-${reportId}`); // Clean up
                return; // Data found, no need to proceed to Firestore logic
            } catch (e) {
                console.error("Could not parse report data from session storage.", e);
                // If parsing fails, fall through to Firestore
            }
        }

        // If no session data, use data from Firestore hook
        if (!isReportLoading && !isUserLoading) {
            if (reportDocFromHook) {
                try {
                    const firestoreData = JSON.parse(reportDocFromHook.reportJson);
                    setReportData(firestoreData);
                } catch (e) {
                    console.error("Could not parse report data from Firestore.", e);
                    setError("Failed to read report data.");
                }
            } else if (reportError) {
                setError(reportError.message);
            } else {
                setError("Report document does not exist.");
            }
            setIsLoading(false);
        }
    }, [reportId, reportDocFromHook, isReportLoading, reportError, isUserLoading]);


    if (isLoading) {
        return <PageLoader />;
    }

    if (error || !reportData) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background text-center text-white">
                <div>
                    <h1 className="text-2xl font-bold">Report Not Found</h1>
                    <p className="text-muted-foreground">
                       The report data could not be loaded. Please try generating it again.
                    </p>
                    {error && <p className='text-xs text-destructive mt-2'>{error}</p>}
                </div>
            </div>
        );
    }
    
    return (
        <>
            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none;
                    }
                    body {
                        background: white !important;
                    }
                    .printable-area {
                        box-shadow: none;
                        border: none;
                    }
                }
            `}</style>
            <main className="max-w-4xl mx-auto p-4 sm:p-8 bg-gray-100">
                <div className="no-print mb-8 flex justify-end gap-2">
                    <Button onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print or Save as PDF
                    </Button>
                </div>
                <div className="printable-area bg-white p-4 sm:p-8 rounded-lg shadow-lg">
                    <PrintableReport data={reportData} />
                </div>
            </main>
        </>
    );
}
