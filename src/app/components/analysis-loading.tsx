import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function AnalysisLoading() {
  return (
    <div className="space-y-6 animate-pulse">
        <Card className="bg-card/60 backdrop-blur-lg border-primary/10">
             <CardHeader>
                <div className='flex justify-between items-center'>
                     <Skeleton className="h-6 w-48" />
                     <Skeleton className="h-8 w-24 rounded-md" />
                </div>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col items-center justify-center text-center p-8 space-y-4'>
                    <Skeleton className="h-20 w-32" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-3 w-full rounded-full mt-2" />
                </div>
            </CardContent>
        </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/60 backdrop-blur-lg border-primary/10">
          <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-lg border-primary/10">
          <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
          </CardContent>
        </Card>
      </div>

       <Card className="bg-card/60 backdrop-blur-lg border-primary/10">
          <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
          <CardContent className="space-y-6">
            {[...Array(5)].map((_, i) => (
                <div key={i} className='space-y-2'>
                    <div className='flex justify-between'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-4 w-12' />
                    </div>
                    <Skeleton className='h-2.5 w-full rounded-full' />
                </div>
            ))}
          </CardContent>
        </Card>
    </div>
  );
}
