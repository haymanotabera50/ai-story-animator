'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, Layers, Lightbulb, Check, Monitor, Smartphone, Square } from 'lucide-react';
import { ArtStyle, AspectRatio } from '@/types/animation';
import { ART_STYLES, SAMPLE_PROMPTS } from '@/lib/constants';

interface PromptSectionProps {
  onGenerate: (prompt: string, style: ArtStyle, sceneCount: number, aspectRatio: AspectRatio) => Promise<void>;
  isLoading: boolean;
}

export const PromptSection: React.FC<PromptSectionProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>('habesha-3d');
  const [sceneCount, setSceneCount] = useState<number>(4);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim(), selectedStyle, sceneCount, aspectRatio);
  };

  const handleSelectSample = (samplePrompt: string, style: ArtStyle) => {
    setPrompt(samplePrompt);
    setSelectedStyle(style);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Decorative ambient gold glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="story-prompt" className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Sparkles className="h-4 w-4 text-amber-400" />
              What story would you like Ahadu to create?
              <span className="text-xs text-amber-400 font-serif">(የታሪኩ ሀሳብ)</span>
            </label>
            <span className="text-xs text-zinc-500">{prompt.length} / 500 characters</span>
          </div>

          <div className="relative">
            <textarea
              id="story-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A young Ethiopian girl in Lalibela discovers a hidden tunnel carved from rose-pink rock where ancient stone angels play golden krars under the moonlight..."
              maxLength={500}
              disabled={isLoading}
              className="w-full resize-none rounded-2xl border border-zinc-700/80 bg-zinc-950/70 p-4 text-sm text-zinc-100 placeholder-zinc-500 shadow-inner focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
            />
          </div>

          {/* Ethiopian inspiration story chips */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              Ethiopian Legends & Ideas:
            </span>
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample.prompt, sample.style)}
                disabled={isLoading}
                className="group flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-300 transition-all hover:border-amber-500/50 hover:bg-zinc-800 hover:text-white"
              >
                <span>{sample.title}</span>
                <span className="text-[10px] text-amber-400/80 font-serif">({sample.amharicTitle})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Art style selector */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-zinc-200">
              Choose Animation Art Style <span className="text-xs text-amber-400 font-serif">(የሥነ-ሥዕል ዘይቤ)</span>
            </label>
            <span className="text-xs text-emerald-400 font-medium">✓ Unlimited Free AI Art</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {ART_STYLES.map((style) => {
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  disabled={isLoading}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border p-2.5 text-left transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30'
                      : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-xl bg-zinc-800">
                    <img
                      src={style.previewImage}
                      alt={style.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-zinc-200 line-clamp-1">{style.name}</span>
                  <span className="text-[10px] text-amber-400/90 font-serif">{style.amharicName}</span>
                  <span className="mt-0.5 text-[10px] text-zinc-400 line-clamp-2 leading-tight">{style.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Aspect Ratio & Scenes Count & Generate */}
        <div className="flex flex-col gap-4 border-t border-zinc-800/80 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            {/* Aspect Ratio Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-400">Aspect Ratio:</span>
              <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/70 p-1">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    aspectRatio === '16:9' ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span>16:9 (YouTube)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    aspectRatio === '9:16' ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>9:16 (TikTok/Shorts)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('1:1')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    aspectRatio === '1:1' ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Square className="h-3.5 w-3.5" />
                  <span>1:1</span>
                </button>
              </div>
            </div>

            {/* Scene duration */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-medium text-zinc-400">
                <Layers className="h-3.5 w-3.5 text-zinc-500" />
                Scenes:
              </span>
              <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/70 p-1">
                {[3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setSceneCount(cnt)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                      sceneCount === cnt
                        ? 'bg-amber-500 text-zinc-950 shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cnt} Scenes (~{cnt * 5}s)
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                <span>Ahadu is Creating Your Animation... (እየተዘጋጀ ነው)</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 stroke-[2.5]" />
                <span>Create Animation with Ahadu</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
