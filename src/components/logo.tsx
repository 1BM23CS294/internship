
import { cn } from '@/lib/utils';
import { ScanText } from 'lucide-react';

export function Logo({ size = 'default' }: { size?: 'default' | 'lg' }) {
  const isLarge = size === 'lg';
  return (
    <div className={cn("flex items-center gap-2", isLarge && "flex-col gap-1")}>
      <ScanText className={cn("text-primary", isLarge ? "h-8 w-8" : "h-6 w-6")} />
      <h1 className={cn("font-bold", isLarge ? "text-2xl" : "text-xl")}>
        Intelligent Resume Analyzer
      </h1>
    </div>
  );
}
