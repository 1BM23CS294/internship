import { CardDescription, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";


export function WelcomeSplash() {
  return (
     <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit mb-4">
          <BrainCircuit className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">
          Intelligent Resume Analyzer
        </CardTitle>
        <CardDescription className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          Leverage AI to go beyond ATS optimization. Get job-specific keyword analysis, automated resume parsing, and detailed hiring recommendations.
        </CardDescription>
    </div>
  );
}
