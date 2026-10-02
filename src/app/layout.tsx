import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ahadu (አሐዱ) — Ethiopian & Global AI Animation Studio',
  description: 'Create rich animated cartoon stories with Ethiopian folklore, Habesha art styles, dynamic camera motion, pentatonic music (Tizita & Bati), and free video export.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}

