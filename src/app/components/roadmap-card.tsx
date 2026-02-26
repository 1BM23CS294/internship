import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, MessageCircle, Files, TrendingUp, Mail, Rocket } from 'lucide-react';

const roadmapFeatures = [
  {
    title: 'Real-time LinkedIn Profile Analysis',
    description: 'Analyze profile strength and consistency with the uploaded resume.',
    icon: <Network className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Interactive Interview Prep',
    description: 'Run mock interview sessions with AI-driven feedback and tailored questions.',
    icon: <MessageCircle className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Multi-Resume Management',
    description: 'Store and manage different versions of resumes for various job applications.',
    icon: <Files className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Job Market Trend Analysis',
    description: 'Get insights into which skills are currently in high demand in specific industries.',
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Cover Letter Generator',
    description: 'Automatically create a tailored cover letter based on the resume and job description.',
    icon: <Mail className="w-6 h-6 text-primary" />,
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
