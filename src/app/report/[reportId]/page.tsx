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

    // The document will be fetched based on the user's UID and the reportId from the URL.
    const reportDocRef = useMemoFirebase(() => {
        // We need to wait for the user to be loaded to get their UID.
        if (!user || !firestore || !reportId) return null;
        // This assumes the report is stored under the currently logged-in user's collection.
        return doc(firestore, 'users', user.uid, 'analysisReports', reportId);
    }, [firestore, user, reportId]);

    // useDoc will handle the loading, error, and data states for the Firestore document.
    const { data: reportDoc, isLoading: isReportLoading, error: reportError } = useDoc(reportDocRef);

    const [reportData, setReportData] = useState<AnalyzedCandidate | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isReportLoading || isUserLoading) {
            // Still loading, do nothing yet.
            return;
        }

        if (reportDoc) {
            try {
                // If the document exists, parse the JSON data.
                const firestoreData = JSON.parse(reportDoc.reportJson);
                setReportData(firestoreData);
                setError(null);
            } catch (e) {
                console.error("Could not parse report data from Firestore.", e);
                setError("Failed to read report data. The format is invalid.");
            }
        } else if (reportError) {
             // If the useDoc hook returned an error (e.g., permissions).
             console.error("Firestore error:", reportError);
             setError("Could not load report due to a database error.");
        } else if (!isReportLoading && !reportDoc) {
             // If loading is finished and there's no document, it doesn't exist.
            setError("Report not found. It may not have been saved to your history yet.");
        }
    }, [reportDoc, isReportLoading, reportError, isUserLoading]);

    // Combined loading state
    if (isReportLoading || isUserLoading) {
        return <PageLoader />;
    }

    if (error || !reportData) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background text-center text-white">
                <div>
                    <h1 className="text-2xl font-bold">Report Not Found</h1>
                    <p className="text-muted-foreground">
                       {error || "The report could not be loaded. Please try again from the dashboard."}
                    </p>
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
