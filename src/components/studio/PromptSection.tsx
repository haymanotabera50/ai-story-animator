'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, Layers, Lightbulb, Check } from 'lucide-react';
import { ArtStyle } from '@/types/animation';
import { ART_STYLES, SAMPLE_PROMPTS } from '@/lib/constants';

interface PromptSectionProps {
  onGenerate: (prompt: string, style: ArtStyle, sceneCount: number) => Promise<void>;
  isLoading: boolean;
}

export const PromptSection: React.FC<PromptSectionProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>('pixar-3d');
  const [sceneCount, setSceneCount] = useState<number>(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim(), selectedStyle, sceneCount);
  };

  const handleSelectSample = (samplePrompt: string, style: ArtStyle) => {
    setPrompt(samplePrompt);
    setSelectedStyle(style);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Decorative ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-purple-600/15 blur-3xl" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="story-prompt" className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Sparkles className="h-4 w-4 text-purple-400" />
              What story do you want to bring to life?
            </label>
            <span className="text-xs text-zinc-500">{prompt.length} / 500 characters</span>
          </div>
          <div className="relative">
            <textarea
              id="story-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A young girl discovers that whenever she waters her houseplant, tiny glowing lanterns bloom on its leaves that illuminate secret doors..."
              maxLength={500}
              disabled={isLoading}
              className="w-full resize-none rounded-xl border border-zinc-700/80 bg-zinc-950/60 p-4 text-sm text-zinc-100 placeholder-zinc-500 shadow-inner focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
            />
          </div>

          {/* Quick inspiration chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              Ideas:
            </span>
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample.prompt, sample.style)}
                disabled={isLoading}
                className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-purple-500/50 hover:bg-zinc-800 hover:text-white"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Art style selector */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-zinc-200">
            Choose Animation Art Style
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ART_STYLES.map((style) => {
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  disabled={isLoading}
                  className={`group relative flex flex-col overflow-hidden rounded-xl border p-2.5 text-left transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10 ring-2 ring-purple-500/30'
                      : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-lg bg-zinc-800">
                    <img
                      src={style.previewImage}
                      alt={style.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 shadow">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-zinc-200 line-clamp-1">{style.name}</span>
                  <span className="mt-0.5 text-[10px] text-zinc-400 line-clamp-2">{style.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scene count & action button */}
        <div className="flex flex-col gap-4 border-t border-zinc-800/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Layers className="h-4 w-4 text-zinc-500" />
              Story Duration:
            </span>
            <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
              {[3, 4, 5].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setSceneCount(cnt)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    sceneCount === cnt
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cnt} Scenes (~{cnt * 5}s)
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-purple-600/25 transition-all hover:opacity-95 hover:shadow-purple-600/40 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Directing Animated Story...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>Generate Animation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

