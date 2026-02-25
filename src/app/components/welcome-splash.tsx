
export function WelcomeSplash() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 md:p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">
          AI Resume Analyzer
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload a resume and job description to get instant AI-powered feedback and a match score.
        </p>
    </div>
  );
}
