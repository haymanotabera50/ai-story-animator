'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { DirectorWorkflow } from '@/components/director/DirectorWorkflow';
import { SettingsModal } from '@/components/modals/SettingsModal';

export default function HomePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50/50 to-rose-50 text-purple-950 selection:bg-pink-300/40 selection:text-purple-950">
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPlayCinema={() => {}}
        hasScenes={false}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        <DirectorWorkflow />
      </main>

      {/* Studio Settings */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
