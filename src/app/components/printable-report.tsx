'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalyzedCandidate } from '@/lib/types';
import {
  CheckCircle2,
  ShieldAlert,
  Award,
  BrainCircuit,
  ListMinus,
  Languages,
  User,
  GraduationCap,
  Briefcase,
  DollarSign,
  TrendingUp,
  UserCog,
  Video,
  Smile,
  Voicemail,
  Lightbulb,
  Clock,
  Users,
  Calendar,
  Link as LinkIcon,
  PenSquare,
  Flame,
  Sparkles,
  Fingerprint,
  Search,
  TrendingDown,
  AlertTriangle,
  GitCompareArrows,
  School,
  Medal,
  Filter,
  FileJson,
  Globe,
  Ship,
} from 'lucide-react';
import Link from 'next/link';

export function PrintableReport({ data }: { data: AnalyzedCandidate }) {
    const { 
    candidate, analysis, recommendations, salaryPrediction, personalityProfile, 
    videoAnalysis, workLifeBalance, networking, resumeRewrite,
    roast, confidenceReport, brandCheck, hiddenStrengths, riskAssessment, skillWarning, versionSuggestion, internshipReport,
    ranking, benchmark, funnelInsights,
    resumeExports, countryRules, visaSponsorship,
  } = data;
  
  const Section: React.FC<{ title: string, icon?: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <Card className="shadow-none border-gray-200">
        <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-800">
                {icon}{title}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {children}
        </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-6">
      <header className="text-center mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-900">{candidate.name}</h1>
        <p className="text-md text-gray-500">Analysis Report</p>
        <p className="text-sm text-gray-400 mt-1">Based on file: {data.fileName}</p>
        {candidate.detectedLanguage && candidate.detectedLanguage.toLowerCase() !== 'english' && (
            <div className="mt-2 flex justify-center">
                <Badge variant="outline" className="flex items-center gap-1.5 border-gray-400 text-gray-600">
                    <Languages size={14} />
                    Translated from {candidate.detectedLanguage}
                </Badge>
            </div>
        )}
      </header>
      
      {/* Overview */}
      <Section title="Overall Score & Recommendation" icon={<Award />}>
        <div className='flex flex-col md:flex-row items-center justify-center gap-8 text-center p-4'>
            <div className='max-w-md text-left space-y-4'>
                <h3 className='text-2xl font-bold text-gray-800 text-center'>{analysis.overallScore}% - {analysis.rating}</h3>
                <p className="text-base text-gray-600">{analysis.explanation}</p>
                 <div>
                    <h4 className='font-semibold text-gray-800 flex items-center gap-2'><BrainCircuit size={16} /> Overall Recommendation</h4>
                    <p className='text-sm text-gray-500'>{recommendations.overallRecommendation}</p>
                </div>
            </div>
        </div>
      </Section>
      
      {/* AI Insights */}
      <Section title="AI Insights" icon={<BrainCircuit />}>
        <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2 text-green-600"><CheckCircle2 size={20} /> Top Strengths</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                {recommendations.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
        </div>
        <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2 text-yellow-600"><ShieldAlert size={20} /> Areas for Improvement</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                {recommendations.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
        </div>
        <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2 text-red-600"><ListMinus size={20} /> Skills Gap</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                {recommendations.skillsGap.length > 0 ? recommendations.skillsGap.map((w, i) => <li key={i}>{w}</li>) : <li>No significant skill gaps found.</li>}
            </ul>
        </div>
      </Section>
      
      {roast && (
        <Section title="Resume Roast" icon={<Flame />}>
            <Badge variant="destructive">{roast.roastLevel} Roast</Badge>
            <blockquote className="border-l-2 pl-4 italic text-gray-600">{roast.roast}</blockquote>
            <div>
                <h4 className='font-semibold mb-2'>Constructive Takeaways</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    {roast.constructiveTakeaways.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
            </div>
        </Section>
      )}

      {confidenceReport && (
        <Section title="Confidence Booster" icon={<Sparkles />}>
            <div className="text-center p-4 rounded-lg bg-gray-100">
                <p className="text-lg text-blue-600">{confidenceReport.empoweringStatement}</p>
            </div>
            <div>
                <h4 className='font-semibold mb-2'>Key Strengths</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    {confidenceReport.keyStrengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </div>
             <div>
                <h4 className='font-semibold mb-2'>Achievement Highlights</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    {confidenceReport.achievementHighlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
            </div>
        </Section>
      )}

      {/* Extracted Details */}
      <Section title="Extracted Resume Details" icon={<User />}>
        <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2"><BrainCircuit size={16}/> Skills</h3>
            <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, i) => <Badge key={i} variant="secondary" className="bg-gray-200 text-gray-700">{skill}</Badge>)}
            </div>
        </div>
        <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2"><Briefcase size={16}/> Work Experience</h3>
            <div className="space-y-4">
                {candidate.experience.map((exp, i) => (
                    <div key={i} className="pl-4 border-l-2 border-gray-300">
                        <p className="font-bold text-gray-800">{exp.title}</p>
                        <p className="text-sm text-gray-500">{exp.company} | {exp.startDate} - {exp.endDate || 'Present'}</p>
                        <p className="text-sm mt-1 text-gray-700">{exp.description}</p>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2"><GraduationCap size={16}/> Education</h3>
                <div className="space-y-4">
                {candidate.education.map((edu, i) => (
                    <div key={i} className="pl-4 border-l-2 border-gray-300">
                        <p className="font-bold text-gray-800">{edu.degree}</p>
                        <p className="text-sm text-gray-500">{edu.institution} | {edu.year}</p>
                    </div>
                ))}
            </div>
        </div>
      </Section>
    </div>
  );
}
