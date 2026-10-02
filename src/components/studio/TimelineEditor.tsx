'use client';

import React from 'react';
import { Plus, Play, Download, Music, Clock } from 'lucide-react';
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
      <div className="flex flex-col gap-4 rounded-3xl border border-pink-200/80 bg-white/80 p-5 shadow-lg shadow-pink-500/5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              className="rounded-xl bg-transparent text-xl font-black text-purple-950 hover:bg-pink-50/80 focus:bg-white focus:px-3 focus:py-1 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-purple-700">
            <span className="flex items-center gap-1 font-semibold">
              <Clock className="h-3.5 w-3.5 text-pink-500" />
              {scenes.length} Scenes • ~{totalDuration}s duration
            </span>
            <span className="text-pink-300">•</span>
            <div className="flex items-center gap-1.5 font-semibold">
              <Music className="h-3.5 w-3.5 text-purple-500" />
              <label htmlFor="bgm-select" className="text-purple-900">
                Music Mode (ቅኝት):
              </label>
              <select
                id="bgm-select"
                value={bgMusic}
                onChange={(e) => onUpdateBgMusic(e.target.value as BgMusicMood)}
                className="rounded-lg border border-pink-200 bg-white px-2.5 py-1 text-xs font-bold text-purple-900 focus:border-pink-400 focus:outline-none shadow-sm"
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
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/25 transition-all hover:opacity-95 hover:scale-105 active:scale-95"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Watch Live Theater</span>
          </button>

          <button
            onClick={onExportVideo}
            className="flex items-center gap-2 rounded-2xl border border-pink-200 bg-white px-4 py-2.5 text-sm font-bold text-purple-900 shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50 hover:text-purple-950 active:scale-95"
          >
            <Download className="h-4 w-4 text-pink-500" />
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
          className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50/30 p-6 text-purple-700 transition-all hover:border-pink-400 hover:bg-pink-100/50 hover:text-purple-950"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-pink-200 bg-white shadow-sm">
            <Plus className="h-6 w-6 text-pink-500" />
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold text-purple-950">Add Next Scene</span>
            <span className="block text-xs text-purple-600">Append next chapter in the story</span>
          </div>
        </button>
      </div>
    </div>
  );
};
