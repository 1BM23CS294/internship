'use client';
import { useState, useEffect } from 'react';
import type { AnalyzedCandidate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';
import { PrintableReport } from '@/app/components/printable-report';

export default function ReportPage() {
    const [reportData, setReportData] = useState<AnalyzedCandidate | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedData = localStorage.getItem('printableReport');
        if (storedData) {
            try {
                setReportData(JSON.parse(storedData));
            } catch (e) {
                console.error("Failed to parse report data from localStorage", e);
            }
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <PageLoader />;
    }

    if (!reportData) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl font-bold">Report Not Found</h1>
                    <p className="text-muted-foreground">The report data could not be loaded. Please try generating it again.</p>
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
