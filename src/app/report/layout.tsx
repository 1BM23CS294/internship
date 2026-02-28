import type { Metadata } from 'next';
import '../globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Printable Report - Intelligent Resume Analyzer',
  description: 'A printable version of the AI-powered resume analysis report.',
};

export default function ReportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
      <body className={cn('font-body antialiased bg-gray-100')}>
        {children}
      </body>
    </html>
  );
}
