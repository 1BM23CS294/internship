import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Intelligent Resume Analyzer',
  description: 'An intelligent resume analyzer to streamline your hiring process.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'dark')}>
        <div className="relative min-h-svh">
            <Image
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"
                alt="Blurry office background"
                fill
                className="object-cover -z-10 filter blur-sm brightness-[.3]"
            />
            {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
