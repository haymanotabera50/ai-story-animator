'use client';

import React from 'react';
import { Plus, Play, Download, Music, Clock, Sparkles } from 'lucide-react';
import { StoryScene, ArtStyle, BgMusicMood } from '@/types/animation';
import { ETHIOPIAN_MUSIC_MODES } from '@/lib/constants';
import { SceneCard } from './SceneCard';

interface TimelineEditorProps {
  title: string;
  onUpdateTitle: (title: string) => void;
  scenes: StoryScene[];
  artStyle: ArtStyle;
  bgMusic: BgMusicMood;
  onUpdateBgMusic: (mood: BgMusicMood) => void;
  onUpdateScene: (scene: StoryScene) => void;
  onDeleteScene: (id: string) => void;
  onAddScene: () => void;
  onPlayCinema: () => void;
  onExportVideo: () => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  title,
  onUpdateTitle,
  scenes,
  artStyle,
  bgMusic,
  onUpdateBgMusic,
  onUpdateScene,
  onDeleteScene,
  onAddScene,
  onPlayCinema,
  onExportVideo,
}) => {
  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || 5), 0);

  return (
    <div className="space-y-6">
      {/* Storyboard Header & Controls */}
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              className="rounded-xl bg-transparent text-xl font-bold text-white hover:bg-zinc-800/60 focus:bg-zinc-800 focus:px-3 focus:py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              {scenes.length} Scenes • ~{totalDuration}s duration
            </span>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1.5">
              <Music className="h-3.5 w-3.5 text-amber-400" />
              <label htmlFor="bgm-select" className="text-zinc-400">
                Music Mode (ቅኝት):
              </label>
              <select
                id="bgm-select"
                value={bgMusic}
                onChange={(e) => onUpdateBgMusic(e.target.value as BgMusicMood)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs font-medium text-amber-300 focus:border-amber-500 focus:outline-none"
              >
                {ETHIOPIAN_MUSIC_MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} ({m.amharic})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Master action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayCinema}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="h-4 w-4 fill-zinc-950" />
            <span>Watch Live Theater</span>
          </button>

          <button
            onClick={onExportVideo}
            className="flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-amber-500/50 hover:bg-zinc-700 hover:text-white active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Export Free Video</span>
          </button>
        </div>
      </div>

      {/* Scenes Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            artStyle={artStyle}
            onUpdate={onUpdateScene}
            onDelete={onDeleteScene}
          />
        ))}

        {/* Add Scene Card */}
        <button
          onClick={onAddScene}
          className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-900/20 p-6 text-zinc-400 transition-all hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-300"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/80">
            <Plus className="h-6 w-6" />
          </div>
          <div className="text-center">
            <span className="block text-sm font-semibold">Add Next Scene</span>
            <span className="block text-xs text-zinc-500">Append next chapter in the story</span>
          </div>
        </button>
      </div>
    </div>
  );
};

