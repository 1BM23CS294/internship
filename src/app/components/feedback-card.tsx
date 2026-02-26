'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function FeedbackCard({ className }: { className?: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
        variant: 'destructive',
      });
      return;
    }
    // In a real app, you'd send this to a backend.
    // For this prototype, we'll just show a toast.
    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for helping us improve!',
    });
    setRating(0);
    setHoverRating(0);
    setComments('');
  };

  return (
    <Card className={cn("bg-black/30 border-primary/20 backdrop-blur-md flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Star size={18} /> Website Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-grow">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Your Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={cn(
                    'h-6 w-6 cursor-pointer transition-colors',
                    (hoverRating >= star || rating >= star)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-muted-foreground/50'
                  )}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2 flex flex-col flex-grow">
            <label htmlFor="feedback-comments" className="text-sm font-medium text-muted-foreground">Additional Comments (Optional)</label>
            <Textarea
              id="feedback-comments"
              placeholder="What could we improve?"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px] bg-black/20 border-border/50 flex-grow"
            />
          </div>
          <Button type="submit" className="w-full">Submit Feedback</Button>
        </form>
      </CardContent>
    </Card>
  );
}
