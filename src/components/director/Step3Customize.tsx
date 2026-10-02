'use client';

import React from 'react';
import {
  Sliders,
  Palette,
  Volume2,
  Music,
  Monitor,
  Smartphone,
  Square,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
} from 'lucide-react';
import { FullStoryScript } from '@/types/director';
import { ArtStyle, AspectRatio, BgMusicMood } from '@/types/animation';
import { ART_STYLES, ETHIOPIAN_MUSIC_MODES } from '@/lib/constants';
import { speakNarration, ambientSoundtrack } from '@/lib/audio-engine';

interface Step3CustomizeProps {
  script: FullStoryScript;
  onUpdateScript: (updated: FullStoryScript) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const Step3Customize: React.FC<Step3CustomizeProps> = ({
  script,
  onUpdateScript,
  onProceed,
  onBack,
}) => {
  const handleTestVoice = () => {
    speakNarration('Selam! This is your customized narrator voice for your animated video.');
  };

  const handleTestMusic = (mode: BgMusicMood) => {
    ambientSoundtrack.playMood(mode);
    setTimeout(() => {
      ambientSoundtrack.stop();
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-6 shadow-xl shadow-pink-500/5 backdrop-blur-xl sm:p-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-600 text-xs font-black text-white">
            3
          </span>
          <h2 className="text-lg font-black text-purple-950 sm:text-xl">
            Customization Studio (የማስተካከያ ምርጫዎች)
          </h2>
        </div>
        <p className="mt-1 text-xs font-medium text-purple-700/80">
          Tailor every detail of your video: visual art style, speech tempo, authentic Ethiopian music scale, and video dimensions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Visual Art Style Selector */}
        <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-6 shadow-lg shadow-pink-500/5 sm:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-black text-purple-950">
              <Palette className="h-4 w-4 text-pink-500" />
              1. Choose Visual Art Style
            </label>
            <span className="text-xs font-bold text-pink-600">Active: {script.style}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {ART_STYLES.map((st) => {
              const isSelected = script.style === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onUpdateScript({ ...script, style: st.id })}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border p-2.5 text-left transition-all ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50/90 ring-2 ring-pink-400/50 shadow-md'
                      : 'border-pink-100 bg-white hover:border-pink-300 hover:bg-pink-50/30'
                  }`}
                >
                  <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-xl bg-purple-100">
                    <img
                      src={st.previewImage}
                      alt={st.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-white shadow">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-purple-950 truncate">{st.name}</span>
                  <span className="text-[10px] text-pink-600 font-serif font-semibold">{st.amharicName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice & Speech Controls */}
        <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-6 shadow-lg shadow-pink-500/5">
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-black text-purple-950">
              <Volume2 className="h-4 w-4 text-pink-500" />
              2. Narration Voice Settings
            </label>
            <button
              onClick={handleTestVoice}
              className="rounded-xl border border-pink-200 bg-pink-50 px-2.5 py-1 text-xs font-bold text-pink-700 hover:bg-pink-100"
            >
              Test Voice
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-purple-900 mb-1">
                <span>Narrator Speed</span>
                <span>{script.voiceSpeed || 0.95}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={script.voiceSpeed || 0.95}
                onChange={(e) => onUpdateScript({ ...script, voiceSpeed: parseFloat(e.target.value) })}
                className="w-full accent-pink-500"
              />
              <div className="flex justify-between text-[10px] text-purple-600 font-semibold mt-0.5">
                <span>Wise Storyteller (0.8x)</span>
                <span>Natural (1.0x)</span>
                <span>Fast Pace (1.2x)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-purple-900 mb-1">
                <span>Voice Pitch</span>
                <span>{script.voicePitch || 1.04}</span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.25"
                step="0.05"
                value={script.voicePitch || 1.04}
                onChange={(e) => onUpdateScript({ ...script, voicePitch: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-purple-600 font-semibold mt-0.5">
                <span>Deep Dramatic</span>
                <span>Balanced</span>
                <span>Bright & Playful</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ethiopian Pentatonic Soundtrack Mode (ቅኝት) */}
        <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-6 shadow-lg shadow-pink-500/5">
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-black text-purple-950">
              <Music className="h-4 w-4 text-purple-500" />
              3. Music Mode (የሙዚቃ ቅኝት)
            </label>
            <span className="text-xs font-bold text-purple-700 font-serif capitalize">
              {script.musicMode}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ETHIOPIAN_MUSIC_MODES.map((m) => {
              const isSelected = script.musicMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onUpdateScript({ ...script, musicMode: m.id });
                    handleTestMusic(m.id);
                  }}
                  className={`flex flex-col rounded-2xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50/90 ring-2 ring-pink-400/40 shadow-sm'
                      : 'border-pink-100 bg-white hover:border-pink-200 hover:bg-pink-50/20'
                  }`}
                >
                  <span className="text-xs font-bold text-purple-950">{m.label}</span>
                  <span className="text-[10px] text-pink-600 font-serif font-semibold">{m.amharic}</span>
                  <span className="mt-1 text-[10px] text-purple-600/80 leading-tight line-clamp-1">
                    {m.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Aspect Ratio & Format */}
        <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-6 shadow-lg shadow-pink-500/5 sm:col-span-2">
          <label className="mb-3 block text-sm font-black text-purple-950">
            4. Video Aspect Ratio & Platform Target
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => onUpdateScript({ ...script, aspectRatio: '16:9' })}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                script.aspectRatio === '16:9'
                  ? 'border-pink-500 bg-pink-50/90 ring-2 ring-pink-400/40 shadow-sm'
                  : 'border-pink-100 bg-white hover:border-pink-200'
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                <Monitor className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xs font-black text-purple-950">16:9 Widescreen</span>
                <span className="block text-[11px] text-purple-600">YouTube, TV & Desktop</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateScript({ ...script, aspectRatio: '9:16' })}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                script.aspectRatio === '9:16'
                  ? 'border-pink-500 bg-pink-50/90 ring-2 ring-pink-400/40 shadow-sm'
                  : 'border-pink-100 bg-white hover:border-pink-200'
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xs font-black text-purple-950">9:16 Vertical Video</span>
                <span className="block text-[11px] text-purple-600">TikTok, Shorts, Reels</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateScript({ ...script, aspectRatio: '1:1' })}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                script.aspectRatio === '1:1'
                  ? 'border-pink-500 bg-pink-50/90 ring-2 ring-pink-400/40 shadow-sm'
                  : 'border-pink-100 bg-white hover:border-pink-200'
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <Square className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xs font-black text-purple-950">1:1 Square</span>
                <span className="block text-[11px] text-purple-600">Instagram Posts</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Nav Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-2xl border border-pink-200 bg-white px-5 py-3 text-xs font-bold text-purple-900 hover:bg-pink-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Script</span>
        </button>

        <button
          onClick={onProceed}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 px-7 py-3 text-sm font-black text-white shadow-xl shadow-purple-500/25 transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Watch Animated Video (ቪዲዮውን ተመልከት)</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
