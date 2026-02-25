import { BrainCircuit, ClipboardCheck, FileSearch, MoveRight } from 'lucide-react';

export function WelcomeSplash() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 md:p-8 text-center">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary/80 to-white">
          Intelligent Resume Analyzer
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
          Leverage AI to instantly screen resumes, score candidates, and uncover the perfect hire.
        </p>
        
        <div className="relative flex items-center justify-center gap-4 md:gap-8">

            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-1/2 -z-10"></div>
            <div className="absolute top-1/2 left-0 w-full h-full bg-gradient-to-t from-background/0 via-background to-background/0 -z-10"></div>
            
            {/* Step 1: Resume */}
            <div className="flex flex-col items-center gap-2 text-center w-40">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-background border-2 border-primary/30 text-primary shadow-lg shadow-primary/10">
                    <FileSearch className="h-10 w-10" />
                </div>
                <h3 className="font-semibold text-lg">Resume</h3>
                <p className="text-xs text-muted-foreground">Upload resume for analysis</p>
            </div>
            
            {/* Step 2: AI Brain */}
            <div className="flex flex-col items-center gap-2 text-center w-40">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-background border-2 border-primary text-primary shadow-2xl shadow-primary/30 relative">
                     <div className="absolute -inset-2 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
                    <BrainCircuit className="h-12 w-12" />
                </div>
                 <h3 className="font-semibold text-lg">AI Analysis</h3>
                 <p className="text-xs text-muted-foreground">Extracts skills & experience</p>
            </div>
            
            {/* Step 3: Report */}
            <div className="flex flex-col items-center gap-2 text-center w-40">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-background border-2 border-primary/30 text-primary shadow-lg shadow-primary/10">
                    <ClipboardCheck className="h-10 w-10" />
                </div>
                 <h3 className="font-semibold text-lg">Analysis Report</h3>
                 <p className="text-xs text-muted-foreground">Get match score & insights</p>
            </div>
        </div>

        <p className="text-sm text-muted-foreground mt-20">
          Start by filling out the form in the sidebar.
        </p>
      </div>
    </div>
  );
}
