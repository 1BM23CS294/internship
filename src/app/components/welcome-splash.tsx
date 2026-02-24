
import { ScanText, Lightbulb, UploadCloud, FileText } from 'lucide-react';

const steps = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Provide Job Description',
    description: 'Paste the job details to set the benchmark for your ideal candidate.',
  },
  {
    icon: <UploadCloud className="h-8 w-8 text-primary" />,
    title: 'Upload a Resume',
    description: 'Upload a candidate\'s resume in PDF or DOCX format for analysis.',
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: 'Get AI-Powered Insights',
    description: 'Receive a match score, strength/weakness analysis, and tailored interview questions.',
  }
];

export function WelcomeSplash() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 text-center rounded-xl">
      <div className="mb-8">
         <div className="flex justify-center items-center w-24 h-24 rounded-full bg-primary/10 border mb-4">
           <ScanText className="h-12 w-12 text-primary" />
         </div>
      </div>
      <h2 className="text-4xl font-bold tracking-tight mb-3">Unlock Your Perfect Hire, Instantly</h2>
      <p className="text-muted-foreground max-w-2xl mb-12 text-lg">
        Streamline your recruitment with AI. Stop manually screening resumes and let our intelligent analysis find the best-fit candidates in seconds.
      </p>
      
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-4">
               <div className="flex items-center justify-center h-16 w-16 bg-background rounded-full border shadow-sm">
                 {step.icon}
               </div>
               <div className="flex-1">
                 <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                 <p className="text-sm text-muted-foreground">{step.description}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
       <p className="text-xs text-muted-foreground mt-16">
        Get started by providing a job description and uploading a resume on the left panel.
      </p>
    </div>
  );
}
