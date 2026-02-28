'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, orderBy, query, Timestamp } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

type Feedback = {
    id: string;
    userName: string;
    userPhotoURL: string | null;
    rating: number;
    comments: string;
    createdAt: Timestamp; 
};

export function FeedbackDisplayCard({ className }: { className?: string }) {
    const firestore = useFirestore();

    const feedbackQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'feedback'), orderBy('createdAt', 'desc'), limit(3));
    }, [firestore]);

    const { data: feedbacks, isLoading, error } = useCollection<Feedback>(feedbackQuery);

    const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'GU';

    const renderContent = () => {
        if (isLoading) {
            return Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                </div>
            ));
        }

        if (error) {
            return <p className="text-sm text-center text-destructive">Could not load feedback.</p>;
        }

        if (!feedbacks || feedbacks.length === 0) {
            return <p className="text-sm text-center text-muted-foreground">No feedback submitted yet. Be the first!</p>;
        }

        return feedbacks.map((feedback) => (
            <div key={feedback.id} className="flex items-start gap-4">
                <Avatar className='h-10 w-10'>
                    <AvatarImage src={feedback.userPhotoURL ?? undefined} alt={feedback.userName} />
                    <AvatarFallback>{getInitials(feedback.userName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className='flex justify-between items-center'>
                        <p className="font-semibold">{feedback.userName}</p>
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
                    <p className="text-sm text-muted-foreground mt-1">{feedback.comments}</p>
                    {feedback.createdAt && (
                         <p className='text-xs text-muted-foreground/70 mt-2'>
                            {formatDistanceToNow(feedback.createdAt.toDate(), { addSuffix: true })}
                        </p>
                    )}
                </div>
            </div>
        ));
    };

  return (
    <Card className={cn("bg-black/20 border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Star size={22} /> What Users Are Saying
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
