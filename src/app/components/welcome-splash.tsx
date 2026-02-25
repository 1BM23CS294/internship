import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanText } from "lucide-react";


export function WelcomeSplash() {
  return (
     <Card className="h-full flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)] p-8 bg-card/10 backdrop-blur-md border-primary/20">
        <CardHeader>
          <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit">
            <ScanText className="w-10 h-10 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">
            AI Resume Analyzer
          </CardTitle>
          <CardDescription className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Upload a resume and job description to get instant AI-powered analysis, a detailed match score, and hiring recommendations.
          </CardDescription>
        </CardContent>
    </Card>
  );
}
