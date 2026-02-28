'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export function FeedbackCard({ className }: { className?: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
        variant: 'destructive',
      });
      return;
    }
    if (!firestore || !user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be signed in to submit feedback.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackCollection = collection(firestore, 'feedback');
      await addDoc(feedbackCollection, {
        userId: user.uid,
        userName: user.displayName || 'Anonymous Guest',
        userPhotoURL: user.photoURL,
        rating,
        comments,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for helping us improve!',
      });
      setRating(0);
      setHoverRating(0);
      setComments('');
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: 'Submission Failed',
        description: 'Could not submit your feedback. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn("bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20 flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Star size={22} /> Share Your Feedback
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Feedback
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
