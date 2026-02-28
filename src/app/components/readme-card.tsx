import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const readmeContent = `# Intelligent Resume Analyzer

This is a web application built with Next.js, Firebase, and Google's Gemini AI to provide intelligent analysis of resumes. It allows recruiters and job seekers to upload resumes, compare them against job descriptions, and get a comprehensive set of AI-powered insights.

---

## Features

- **Multi-Resume Analysis:** Upload and analyze multiple resumes at once against a single job description.
- **AI-Powered Scoring:** Get an overall match score and a detailed explanation of how a resume fits a role.
- **Advanced Analysis Modules:**
    - **Resume Roast:** Fun but insightful feedback on a resume.
    - **Confidence Booster:** Highlights key strengths and empowering statements.
    - **Personal Brand Check:** Analyzes brand consistency.
    - **And many more...** (See the "How It Works" section on the dashboard).
- **Enterprise & International Features:**
    - Candidate Ranking & Team Benchmarking.
    - Country-Specific Resume Rules & Visa Sponsorship Readiness.
- **Firebase Integration:** User authentication and data storage for analysis history are managed with Firebase.

---

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)

### 2. Setup

1.  **Install dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

2.  **Get a Gemini API Key:**
    This project's AI features are powered by the Google Gemini API. You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

3.  **Set up your environment file:**
    - In the root of the project, you will find a \`.env\` file.
    - Open it and replace \`YOUR_API_KEY_HERE\` with the key you obtained in the previous step:
      \`\`\`env
      GEMINI_API_KEY="YOUR_API_KEY_HERE"
      \`\`\`

4.  **Run the development server:**
    \`\`\`bash
    npm run dev
    \`\`\`
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **AI:** [Google Gemini via Genkit](https://firebase.google.com/docs/genkit)
- **UI:** [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database:** [Firebase Authentication](https://firebase.google.com/docs/auth), [Firestore](https://firebase.google.com/docs/firestore)
`;

export function ReadmeCard() {
  return (
    <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <BookText size={22} /> Project README
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full rounded-md border border-border/50 bg-black/20 p-4">
            <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-mono">
                <code>
                    {readmeContent}
                </code>
            </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
