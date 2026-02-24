
import { FileText, UploadCloud, Lightbulb, Bot } from 'lucide-react';

export function WelcomeSplash() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 md:p-8 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary to-blue-500 rounded-full blur-xl opacity-20"></div>
          <div className="relative flex justify-center items-center w-32 h-32 rounded-full bg-primary/10 border-2 border-primary/20 shadow-lg mx-auto">
            <Bot className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
          Intelligent Resume Analyzer
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Leverage AI to instantly screen resumes, score candidates, and uncover the perfect hire.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-card border rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">1. Job Description</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Paste the job description to set the benchmark for your ideal candidate.
            </p>

          </div>
          
          <div className="p-6 bg-card border rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-3">
               <div className="bg-primary/10 p-2 rounded-lg">
                <UploadCloud className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">2. Upload Resume</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a candidate’s resume in PDF or DOCX format for analysis.
            </p>
          </div>

          <div className="p-6 bg-card border rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-3">
               <div className="bg-primary/10 p-2 rounded-lg">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">3. Get Insights</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Receive a match score, strength/weakness analysis, and tailored interview questions.
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-12">
          Start by filling out the form in the sidebar.
        </p>
      </div>
    </div>
  );
}
