'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Sparkles, Lightbulb, Bot } from 'lucide-react';

const features = [
  {
    title: '1. Core Analysis',
    icon: <FileText className="w-5 h-5" />,
    instructions: [
      "Paste the full job description into the text area.",
      "Click 'Select a resume file...' to upload a candidate's resume (PDF or DOCX).",
      "Choose the relevant country for salary prediction.",
      "Click 'Next' to proceed to advanced options."
    ],
  },
  {
    title: '2. Advanced Analysis Modules',
    icon: <Sparkles className="w-5 h-5" />,
    instructions: [
        "On Step 2, you'll find several checkboxes for advanced AI reports.",
        "Each module provides a unique report. Enable the ones you need.",
        "Modules include Resume Roast, Confidence Booster, Career Risk, and more.",
        "Click 'Analyze Now' to start the process."
    ],
  },
  {
    title: '3. Interpreting the AI Report',
    icon: <Lightbulb className="w-5 h-5" />,
    instructions: [
      "After analysis, a detailed report appears with multiple tabs.",
      "The 'Overview' tab shows the overall match score and AI recommendation.",
      "Other tabs like 'Performance', 'Salary', 'Personality', and the advanced module tabs contain specific insights.",
      "Use the 'Resume Details' tab to see the raw extracted information."
    ],
  },
];

export function HowToUse() {
  return (
    <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Bot size={22} /> How to Use the Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue='item-0'>
          {features.map((feature, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-3">
                  <div className="text-primary">{feature.icon}</div>
                  {feature.title}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-10 pr-4 space-y-2 text-sm text-muted-foreground">
                    {feature.instructions.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
