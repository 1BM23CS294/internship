'use client';

import * as React from 'react';
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Flame, Sparkles, Fingerprint, Search, TrendingDown, AlertTriangle, GitCompareArrows, School, Briefcase } from 'lucide-react';

const features = [
  {
    title: 'Resume Roast Mode',
    icon: <Flame className="w-10 h-10 mx-auto text-primary" />,
    description: 'Get fun but insightful feedback on a resume to find areas for improvement.'
  },
  {
    title: 'Confidence Booster',
    icon: <Sparkles className="w-10 h-10 mx-auto text-primary" />,
    description: 'Generate a report that highlights key strengths and empowering statements.'
  },
  {
    title: 'Personal Brand Check',
    icon: <Fingerprint className="w-10 h-10 mx-auto text-primary" />,
    description: 'Analyze the resume for brand consistency and get suggestions for strengthening it.'
  },
  {
    title: 'Hidden Strength Discovery',
    icon: <Search className="w-10 h-10 mx-auto text-primary" />,
    description: 'Uncover valuable skills and traits that are implied but not explicitly stated.'
  },
  {
    title: 'Career Risk Assessment',
    icon: <TrendingDown className="w-10 h-10 mx-auto text-primary" />,
    description: 'Assess industry stability and role risk based on the candidate\'s profile.'
  },
  {
    title: 'Skill Obsolescence Warning',
    icon: <AlertTriangle className="w-10 h-10 mx-auto text-primary" />,
    description: 'Identify skills that may be losing relevance and get suggestions for modern alternatives.'
  },
  {
    title: 'AI Resume Versioning',
    icon: <GitCompareArrows className="w-10 h-10 mx-auto text-primary" />,
    description: 'Get AI-powered suggestions for tailoring a resume to a specific job description.'
  },
  {
    title: 'Internship Readiness Score',
    icon: <School className="w-10 h-10 mx-auto text-primary" />,
    description: 'A special analysis for students to gauge their readiness for internships.'
  },
  {
    title: 'Executive & Fresher Modes',
    icon: <Briefcase className="w-10 h-10 mx-auto text-primary" />,
    description: 'Tailor the analysis for recent graduates or seasoned executive professionals.'
  }
];

export function FeatureCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Card className="bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20">
        <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">Powerful New AI Features</h2>
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent>
                    {features.map((feature, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                        <Card className="bg-black/40 border-primary/30 h-full">
                            <CardContent className="flex flex-col items-center justify-center text-center p-6 gap-4">
                                {feature.icon}
                                <h3 className="text-lg font-semibold">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </CardContent>
    </Card>
  )
}
