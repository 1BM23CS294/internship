import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Logo } from '@/components/logo';
import {
  Blocks,
  BookOpen,
  BrainCircuit,
  DatabaseZap,
  Gauge,
  Layers,
  Palette,
  Rocket,
  Scaling,
  Sparkles,
  Target,
  Telescope,
} from 'lucide-react';

const steps = [
  {
    title: 'Step 1: Solve a Real-World Problem',
    icon: <Target className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p>Your project must address an actual pain point.</p>
        <p className="font-semibold">Examples:</p>
        <ul className="list-disc list-inside">
          <li>Resume shortlisting automation</li>
          <li>AI interview preparation</li>
          <li>Fake news detection</li>
          <li>Healthcare prediction</li>
        </ul>
        <p className="font-semibold">Ask:</p>
        <ul className="list-disc list-inside">
          <li>Who will use it?</li>
          <li>Why will they care?</li>
          <li>What problem is solved better than existing solutions?</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Step 2: Unique Idea / Innovation',
    icon: <Sparkles className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p>Your project must have something new. Instead of a simple keyword match, use semantic similarity.</p>
        <p className="font-semibold">Add:</p>
        <ul className="list-disc list-inside">
          <li>AI/ML component</li>
          <li>Automation</li>
          <li>Real-time processing</li>
          <li>Personalization</li>
          <li>Smart recommendations</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Step 3: Strong Tech Stack',
    icon: <Layers className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p>Use modern technologies that companies love.</p>
        <p className="font-semibold">Recommended Stack:</p>
        <ul className="list-disc list-inside">
          <li>Frontend: React / Next.js</li>
          <li>Backend: Node.js / Python Flask</li>
          <li>Database: Firebase / MongoDB</li>
          <li>AI: NLP / ML models</li>
          <li>Deployment: Vercel / AWS</li>
        </ul>
        <p>Unicorn projects are always deployable.</p>
      </div>
    ),
  },
  {
    title: 'Step 4: Scalability',
    icon: <Scaling className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p>Your project should be designed to handle growth in users and data while maintaining fast responses.</p>
        <p className="font-semibold">Use:</p>
        <ul className="list-disc list-inside">
          <li>Cloud storage</li>
          <li>APIs</li>
          <li>Efficient algorithms</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Step 5: Clean Architecture',
    icon: <Blocks className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p>Follow a clear structure, like Frontend → API → Backend → Database. This is important for interviews and placements.</p>
        <p className="font-semibold">Use:</p>
        <ul className="list-disc list-inside">
          <li>MVC pattern</li>
          <li>Modular code</li>
          <li>Reusable components</li>
        </ul>
      </div>
    ),
  },
    {
    title: 'Step 6: Smart Algorithms',
    icon: <BrainCircuit className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p>Your project must include smart systems.</p>
         <p className="font-semibold">Examples:</p>
        <ul className="list-disc list-inside">
          <li>Optimization</li>
          <li>ML/NLP</li>
          <li>Recommendation system</li>
          <li>Ranking system (like this app's scoring algorithm)</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Step 7: UI/UX Matters',
    icon: <Palette className="h-5 w-5" />,
    content: (
        <div className="space-y-2">
            <p>A bad UI gives a bad project impression. Recruiters love:</p>
            <ul className="list-disc list-inside">
                <li>Clean UI</li>
                <li>Fast response</li>
                <li>Simple navigation</li>
                <li>Mobile friendly</li>
            </ul>
        </div>
    ),
  },
    {
    title: 'Step 8: Real Data Usage',
    icon: <DatabaseZap className="h-5 w-5" />,
    content: (
        <div className="space-y-2">
            <p>Using fake data reduces impact. Use:</p>
            <ul className="list-disc list-inside">
                <li>Real datasets</li>
                <li>APIs</li>
                <li>Live user inputs</li>
            </ul>
        </div>
    ),
  },
  {
    title: 'Step 9: Deployment (Most Important)',
    icon: <Rocket className="h-5 w-5" />,
    content: (
        <div className="space-y-2">
            <p>A unicorn project must have a live website, a working demo, and a GitHub repo.</p>
            <p className="font-semibold">Deploy using:</p>
            <ul className="list-disc list-inside">
                <li>Vercel</li>
                <li>Netlify</li>
                <li>Firebase</li>
                <li>AWS</li>
            </ul>
        </div>
    ),
  },
  {
    title: 'Step 10: Documentation',
    icon: <BookOpen className="h-5 w-5" />,
    content: (
        <div className="space-y-2">
            <p>Good documentation is crucial for placements.</p>
            <p className="font-semibold">Include:</p>
            <ul className="list-disc list-inside">
                <li>README</li>
                <li>Architecture diagram</li>
                <li>API documentation</li>
                <li>Screenshots & Demo video</li>
            </ul>
        </div>
    ),
  },
  {
    title: 'Step 11: Performance Metrics',
    icon: <Gauge className="h-5 w-5" />,
    content: (
       <div className="space-y-2">
            <p>Showcasing results makes a project look professional.</p>
            <p className="font-semibold">Metrics to show:</p>
            <ul className="list-disc list-inside">
                <li>Accuracy</li>
                <li>Speed</li>
                <li>Precision/Recall (if ML)</li>
                <li>Response time</li>
            </ul>
        </div>
    ),
  },
  {
    title: 'Step 12: Future Scope',
    icon: <Telescope className="h-5 w-5" />,
    content: (
        <div className="space-y-2">
            <p>Always include what could come next. This shows research and forward-thinking.</p>
            <p className="font-semibold">Consider:</p>
            <ul className="list-disc list-inside">
                <li>Scalability improvements</li>
                <li>AI model enhancements</li>
                <li>New integration options</li>
            </ul>
        </div>
    ),
  },
];

export function WelcomeSplash() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-card rounded-xl border-2 border-dashed">
      <div className="mb-6">
        <Logo />
      </div>
      <h2 className="text-3xl font-bold mb-2">Steps to Build a Unicorn-Level Project</h2>
      <p className="text-muted-foreground max-w-3xl mb-10">
        Follow these 12 steps to take your project from an idea to a high-impact, professional-grade application that stands out to recruiters and makes a real-world difference.
      </p>
      <div className="w-full max-w-4xl text-left">
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          {steps.map((step, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <span className="text-primary">{step.icon}</span>
                  <span className="font-semibold">{step.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-11 text-muted-foreground">
                {step.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
