'use client';

import React from 'react';
import { Sparkles, Film, Settings, Play } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onPlayCinema: () => void;
  hasScenes: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onPlayCinema,
  hasScenes,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
            <Film className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">StoryMorph</span>
              <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-500/20">
                AI Animation Studio
              </span>
            </div>
            <p className="text-xs text-zinc-400">Prompt-to-Animated Cartoon Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasScenes && (
            <button
              onClick={onPlayCinema}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-indigo-600/40 active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Watch Animation</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            title="Studio Settings & API Keys"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

