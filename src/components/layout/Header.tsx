'use client';

import React from 'react';
import { Play, Settings, Sparkles } from 'lucide-react';
import { EthiopianCross } from '@/components/common/EthiopianCross';
import { TibebPattern } from '@/components/common/TibebPattern';

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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      {/* Authentic Ethiopian Tibeb embroidered pattern top edge */}
      <TibebPattern />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-2 shadow-lg shadow-amber-500/20">
            <EthiopianCross size={26} className="text-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Ahadu <span className="text-amber-400 font-serif">አሐዱ</span>
              </h1>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 ring-1 ring-inset ring-amber-500/20">
                <Sparkles className="h-3 w-3" />
                100% Free
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Ethiopian & Global AI Animation Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasScenes && (
            <button
              onClick={onPlayCinema}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="h-4 w-4 fill-zinc-950" />
              <span>Watch Animation</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-amber-500/40 hover:bg-zinc-800 hover:text-white"
            title="Studio Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

