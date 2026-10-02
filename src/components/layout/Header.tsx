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
    <header className="sticky top-0 z-40 w-full border-b border-pink-200/70 bg-white/80 backdrop-blur-md shadow-sm shadow-pink-500/5">
      {/* Ethiopian Tibeb embroidered pattern top edge */}
      <TibebPattern />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-400 via-purple-400 to-violet-500 p-2 shadow-lg shadow-purple-500/20">
            <EthiopianCross size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-purple-950">
                Ahadu <span className="text-pink-600 font-serif font-bold">አሐዱ</span>
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-bold text-pink-700 ring-1 ring-inset ring-pink-300/60">
                <Sparkles className="h-3 w-3" />
                100% Free
              </span>
            </div>
            <p className="text-xs font-medium text-purple-600/80">
              Ethiopian & Global AI Animation Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasScenes && (
            <button
              onClick={onPlayCinema}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-purple-500/25 transition-all hover:opacity-95 hover:shadow-purple-500/40 active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Watch Animation</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-200 bg-white/80 text-purple-700 shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50 hover:text-purple-950"
            title="Studio Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
