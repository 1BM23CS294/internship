'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockFeedback = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatarUrl: 'https://picsum.photos/seed/a/150/150',
    rating: 5,
    comment: "This tool is incredible! The analysis is so detailed and has completely changed our hiring workflow for the better. A must-have for any recruiter.",
    date: '2 days ago',
  },
  {
    id: 2,
    name: 'Samantha Lee',
    avatarUrl: 'https://picsum.photos/seed/b/150/150',
    rating: 4,
    comment: "Really powerful features, especially the resume roast and salary prediction. The UI is slick and easy to use. Would love to see a bulk upload feature soon!",
    date: '5 days ago',
  },
    {
    id: 3,
    name: 'David Chen',
    avatarUrl: 'https://picsum.photos/seed/c/150/150',
    rating: 5,
    comment: "The best resume analyzer I've ever used. The international rules and visa sponsorship readiness checks are features I haven't seen anywhere else.",
    date: '1 week ago',
  }
];

export function FeedbackDisplayCard({ className }: { className?: string }) {
  return (
    <Card className={cn("bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Star size={22} /> What Users Are Saying
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mockFeedback.map((feedback) => (
          <div key={feedback.id} className="flex items-start gap-4">
            <Avatar className='h-10 w-10'>
                <AvatarImage src={feedback.avatarUrl} alt={feedback.name} />
                <AvatarFallback>{feedback.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className='flex justify-between items-center'>
                 <p className="font-semibold">{feedback.name}</p>
                 <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                        key={star}
                        className={cn(
                            'h-4 w-4',
                            feedback.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
                        )}
                        />
                    ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{feedback.comment}</p>
              <p className='text-xs text-muted-foreground/70 mt-2'>{feedback.date}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
