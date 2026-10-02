import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StoryMorph — AI Animation & Cartoon Video Studio',
  description: 'Generate animated cartoon stories with dynamic camera motion, voice narration, and video export from simple text prompts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-purple-500/30">
        {children}
      </body>
    </html>
  );
}

