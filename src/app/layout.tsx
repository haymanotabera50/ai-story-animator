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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gradient-to-br from-pink-50 via-purple-50/60 to-rose-50 text-purple-950 selection:bg-pink-300/40 selection:text-purple-950">
        {children}
      </body>
    </html>
  );
}
