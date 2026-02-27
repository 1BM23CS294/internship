import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, School, Files, Users, Code, Palette, AreaChart, Filter, Medal, Rocket } from 'lucide-react';

const roadmapFeatures = [
  {
    title: 'Recruiter Dashboard',
    description: 'A dedicated dashboard for recruiters to manage candidates and track analysis history.',
    icon: <LayoutDashboard className="w-6 h-6 text-primary" />,
  },
  {
    title: 'University Placement Mode',
    description: 'Specialized tools for university career centers to help students prepare for job placements.',
    icon: <School className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Bulk Resume Analysis',
    description: 'Upload and analyze multiple resumes at once to quickly screen a batch of candidates.',
    icon: <Files className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Team Resume Benchmarking',
    description: 'Compare the skills and experience across your existing team to identify strengths and gaps.',
    icon: <Users className="w-6 h-6 text-primary" />,
  },
  {
    title: 'API for Job Portals',
    description: 'Integrate our powerful analysis engine directly into your own job board or HR software.',
    icon: <Code className="w-6 h-6 text-primary" />,
  },
  {
    title: 'White-label Version for Colleges',
    description: 'Offer a branded version of the analyzer to your students as part of your career services.',
    icon: <Palette className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Resume Analytics for Companies',
    description: 'Gain insights from aggregated resume data to understand your talent pool better.',
    icon: <AreaChart className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Hiring Funnel Optimization',
    description: 'Get AI-driven insights on how to improve your hiring funnel and reduce time-to-hire.',
    icon: <Filter className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Candidate Ranking System',
    description: 'Automatically rank candidates based on their match score and custom criteria.',
    icon: <Medal className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Screening Automation for Startups',
    description: 'A streamlined, fast, and affordable screening solution designed for startups.',
    icon: <Rocket className="w-6 h-6 text-primary" />,
  },
];

export function RoadmapCard() {
  return (
    <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Rocket size={22} /> Roadmap for Future Improvements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {roadmapFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">{feature.icon}</div>
              <div>
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
