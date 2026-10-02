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
    <div className="relative overflow-hidden rounded-3xl border border-pink-200/80 bg-white/80 p-6 shadow-xl shadow-pink-500/5 backdrop-blur-xl sm:p-8">
      {/* Decorative ambient soft pink & purple glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-300/30 to-purple-300/30 blur-3xl" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="story-prompt" className="flex items-center gap-2 text-sm font-bold text-purple-950">
              <Sparkles className="h-4 w-4 text-pink-500" />
              What story would you like Ahadu to create?
              <span className="text-xs text-pink-600 font-serif font-semibold">(የታሪኩ ሀሳብ)</span>
            </label>
            <span className="text-xs text-purple-600/70 font-medium">{prompt.length} / 500 characters</span>
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
              className="w-full resize-none rounded-2xl border border-pink-200/90 bg-purple-50/40 p-4 text-sm font-medium text-purple-950 placeholder-purple-400/80 shadow-inner focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-300/40 disabled:opacity-50"
            />
          </div>

          {/* Inspiration story chips */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-pink-700">
              <Lightbulb className="h-3.5 w-3.5 text-pink-500" />
              Story Ideas:
            </span>
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample.prompt, sample.style)}
                disabled={isLoading}
                className="group flex items-center gap-1.5 rounded-full border border-pink-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-purple-900 shadow-sm transition-all hover:border-pink-400 hover:bg-pink-50 hover:text-purple-950"
              >
                <span>{sample.title}</span>
                <span className="text-[10px] text-pink-600 font-serif">({sample.amharicTitle})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Art style selector */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-bold text-purple-950">
              Choose Animation Art Style <span className="text-xs text-pink-600 font-serif font-semibold">(የሥነ-ሥዕል ዘይቤ)</span>
            </label>
            <span className="text-xs text-purple-600 font-bold bg-purple-100/80 px-2 py-0.5 rounded-full">
              ✓ 100% Free AI Art
            </span>
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
                      ? 'border-pink-500 bg-pink-50/90 shadow-md shadow-pink-500/10 ring-2 ring-pink-400/40'
                      : 'border-pink-100/80 bg-white/80 hover:border-pink-300 hover:bg-white'
                  }`}
                >
                  <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-xl bg-purple-100">
                    <img
                      src={style.previewImage}
                      alt={style.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-white shadow">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-purple-950 line-clamp-1">{style.name}</span>
                  <span className="text-[10px] text-pink-600 font-serif font-semibold">{style.amharicName}</span>
                  <span className="mt-0.5 text-[10px] text-purple-700/80 line-clamp-2 leading-tight">{style.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Aspect Ratio & Scenes Count & Generate */}
        <div className="flex flex-col gap-4 border-t border-pink-200/70 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            {/* Aspect Ratio Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-900">Aspect Ratio:</span>
              <div className="flex rounded-xl border border-pink-200 bg-purple-50/50 p-1">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    aspectRatio === '16:9'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow'
                      : 'text-purple-750 hover:text-purple-950'
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span>16:9 (YouTube)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow'
                      : 'text-purple-750 hover:text-purple-950'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>9:16 (Shorts)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('1:1')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    aspectRatio === '1:1'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow'
                      : 'text-purple-750 hover:text-purple-950'
                  }`}
                >
                  <Square className="h-3.5 w-3.5" />
                  <span>1:1</span>
                </button>
              </div>
            </div>

            {/* Scene duration */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-purple-900">
                <Layers className="h-3.5 w-3.5 text-purple-500" />
                Scenes:
              </span>
              <div className="flex rounded-xl border border-pink-200 bg-purple-50/50 p-1">
                {[3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setSceneCount(cnt)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                      sceneCount === cnt
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow'
                        : 'text-purple-750 hover:text-purple-950'
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
            className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:opacity-95 hover:shadow-purple-500/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
