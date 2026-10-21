'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb, Bot, Check, Wand2, Zap, Play, Layers } from 'lucide-react';
import { StoryAngle } from '@/types/director';
import { ArtStyle } from '@/types/animation';
import { SAMPLE_PROMPTS, ART_STYLES } from '@/lib/constants';

interface Step1IdeationProps {
  initialPrompt: string;
  onSelectAngle: (angle: StoryAngle, prompt: string) => void;
  onInstantGenerateVideo: (prompt: string, style: ArtStyle) => void;
  onBrainstorm: (prompt: string) => { directorGreeting: string; angles: StoryAngle[] };
}

export const Step1Ideation: React.FC<Step1IdeationProps> = ({
  initialPrompt,
  onSelectAngle,
  onInstantGenerateVideo,
  onBrainstorm,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>('habesha-3d');
  const [directorData, setDirectorData] = useState<{
    directorGreeting: string;
    angles: StoryAngle[];
  } | null>(() => (initialPrompt ? onBrainstorm(initialPrompt) : null));
  const [selectedAngleId, setSelectedAngleId] = useState<string>('angle-1');
  const [isInstantGenerating, setIsInstantGenerating] = useState(false);

  const handleInstantCreate = () => {
    if (!prompt.trim()) return;
    setIsInstantGenerating(true);
    onInstantGenerateVideo(prompt.trim(), selectedStyle);
  };

  const handleGenerateIdeas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    const res = onBrainstorm(prompt.trim());
    setDirectorData(res);
    if (res.angles.length > 0) {
      setSelectedAngleId(res.angles[0].id);
    }
  };

  const handlePickInspiration = (p: string, st: ArtStyle) => {
    setPrompt(p);
    setSelectedStyle(st);
    const res = onBrainstorm(p);
    setDirectorData(res);
    if (res.angles.length > 0) {
      setSelectedAngleId(res.angles[0].id);
    }
  };

  const handleProceed = () => {
    if (!directorData) return;
    const chosen = directorData.angles.find((a) => a.id === selectedAngleId) || directorData.angles[0];
    onSelectAngle(chosen, prompt.trim());
  };

  return (
    <div className="space-y-6">
      {/* Prompt input card */}
      <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-6 shadow-xl shadow-pink-500/5 backdrop-blur-xl sm:p-8">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-pink-500 text-xs font-black text-white">
              1
            </span>
            <h2 className="text-lg font-black text-purple-950 sm:text-xl">
              Describe Your Animation Video (የቪዲዮው ሀሳብ)
            </h2>
          </div>
          <p className="mt-1 text-xs font-medium text-purple-700/80">
            Enter any prompt or story idea. Click <strong>"Instant Create Video"</strong> to produce and play your video right away, or explore creative angles!
          </p>
        </div>

        <form onSubmit={handleGenerateIdeas} className="space-y-5">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A young shepherd boy named Kaldi in ancient Kaffa discovers dancing goats under red coffee trees..."
              className="w-full resize-none rounded-2xl border border-pink-200 bg-purple-50/40 p-4 text-sm font-medium text-purple-950 placeholder-purple-400 focus:bg-white focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/40"
            />
          </div>

          {/* Quick Style Picker */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-purple-950">
                Choose Art Style
              </label>
              <span className="text-[11px] font-bold text-pink-600">Active: {selectedStyle}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {ART_STYLES.map((st) => {
                const isSelected = selectedStyle === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStyle(st.id)}
                    className={`rounded-xl border p-2 text-left transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50 text-purple-950 font-bold ring-2 ring-pink-400/40 shadow-sm'
                        : 'border-pink-100 bg-white/70 text-purple-800 hover:bg-pink-50/40'
                    }`}
                  >
                    <span className="block text-xs truncate">{st.name}</span>
                    <span className="block text-[10px] text-pink-600 font-serif truncate">
                      {st.amharicName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inspiration chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="flex items-center gap-1 text-xs font-bold text-pink-700">
              <Lightbulb className="h-3.5 w-3.5 text-pink-500" />
              Story Ideas:
            </span>
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePickInspiration(sample.prompt, sample.style)}
                className="rounded-full border border-pink-200 bg-white px-3 py-1 text-xs font-semibold text-purple-800 shadow-sm transition-all hover:border-pink-400 hover:bg-pink-50 hover:text-purple-950"
              >
                {sample.title}
              </button>
            ))}
          </div>

          {/* Action buttons: 1-Click Instant Video vs Step-by-Step */}
          <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="flex items-center justify-center gap-2 rounded-2xl border border-pink-300 bg-white px-5 py-3 text-xs font-bold text-purple-900 shadow-sm transition-all hover:border-pink-400 hover:bg-pink-50 disabled:opacity-50"
            >
              <Wand2 className="h-4 w-4 text-purple-600" />
              <span>Explore Story Angles & Customize (ደረጃ በደረጃ)</span>
            </button>

            <button
              type="button"
              onClick={handleInstantCreate}
              disabled={!prompt.trim() || isInstantGenerating}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 px-7 py-3 text-sm font-black text-white shadow-xl shadow-purple-500/25 transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Zap className="h-4 w-4 fill-white" />
              <span>⚡ Instant Create Video (ቀጥታ ቪዲዮውን ፍጠር)</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI Director Response & 3 Pitches (when exploring step-by-step) */}
      {directorData && (
        <div className="space-y-5 rounded-3xl border border-purple-200 bg-gradient-to-br from-pink-50/80 via-white/90 to-purple-50/80 p-6 shadow-xl shadow-purple-500/5 backdrop-blur-xl sm:p-8">
          <div className="flex items-start gap-3 rounded-2xl border border-pink-200/80 bg-white/90 p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-400 to-purple-600 text-white shadow-md">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-pink-600">
                Ahadu AI Director
              </span>
              <p className="mt-1 text-sm font-medium text-purple-950 leading-relaxed">
                {directorData.directorGreeting}
              </p>
            </div>
          </div>

          {/* 3 Story Angle Options */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {directorData.angles.map((angle) => {
              const isSelected = selectedAngleId === angle.id;
              return (
                <div
                  key={angle.id}
                  onClick={() => setSelectedAngleId(angle.id)}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-pink-500 bg-white shadow-xl shadow-pink-500/10 ring-2 ring-pink-400/40'
                      : 'border-pink-200/80 bg-white/80 hover:border-pink-300 hover:bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white shadow">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-800">
                      Direction {angle.id.replace('angle-', '#')}
                    </span>
                    <h3 className="mt-2 text-base font-black text-purple-950">{angle.title}</h3>
                    <p className="text-xs font-serif text-pink-600">{angle.amharicTitle}</p>
                    <p className="mt-2 text-xs font-semibold text-purple-700/90 leading-snug">
                      {angle.hook}
                    </p>
                    <p className="mt-2 text-[11px] font-medium text-purple-900/70 leading-relaxed">
                      {angle.synopsis}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-pink-100 pt-3 text-[11px] font-bold text-pink-700">
                    Recommended Style: <span className="capitalize text-purple-900">{angle.recommendedStyle}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleProceed}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-purple-500/25 transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Draft Full Scene Script (ወደ ስክሪፕት ቀጥል)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
