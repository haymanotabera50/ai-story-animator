'use client';

import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Download,
  Maximize2,
  Volume2,
  VolumeX,
  Layers,
  Monitor,
  Smartphone,
  Square,
  Dice5,
  Film,
  Camera,
  Music,
  Check,
  Clock,
  ChevronDown,
  Loader2,
  Trash2,
} from 'lucide-react';
import { StoryProject, StoryScene, ArtStyle, AspectRatio, BgMusicMood, CameraMotion } from '@/types/animation';
import { ART_STYLES, SAMPLE_PROMPTS, ETHIOPIAN_MUSIC_MODES, CAMERA_MOTIONS } from '@/lib/constants';
import { enhancePromptWithAI } from '@/lib/prompt-enhancer';
import { speakNarration, ambientSoundtrack } from '@/lib/audio-engine';
import { EthiopianCross } from '@/components/common/EthiopianCross';

interface LeonardoStudioProps {
  currentProject: StoryProject;
  historyProjects: StoryProject[];
  isGenerating: boolean;
  generationProgress: number;
  generationStatus: string;
  onGenerate: (prompt: string, style: ArtStyle, sceneCount: number, aspectRatio: AspectRatio) => Promise<void>;
  onSelectProject: (proj: StoryProject) => void;
  onOpenExport: () => void;
  onOpenCinema: () => void;
  onDeleteProject: (id: string) => void;
}

export const LeonardoStudio: React.FC<LeonardoStudioProps> = ({
  currentProject,
  historyProjects,
  isGenerating,
  generationProgress,
  generationStatus,
  onGenerate,
  onSelectProject,
  onOpenExport,
  onOpenCinema,
  onDeleteProject,
}) => {
  const [prompt, setPrompt] = useState(currentProject.prompt);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>(currentProject.style);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(currentProject.aspectRatio);
  const [sceneCount, setSceneCount] = useState<number>(currentProject.scenes.length || 3);
  const [selectedMotion, setSelectedMotion] = useState<CameraMotion>('zoom-in');
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Player state for active featured video
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioStopperRef = React.useRef<{ stop: () => void } | null>(null);
  const sceneTimerRef = React.useRef<any>(null);

  const currentScene = currentProject.scenes[activeSceneIdx] || currentProject.scenes[0];

  // Leonardo Magic Prompt Enhancer
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setTimeout(() => {
      const enhanced = enhancePromptWithAI(prompt, selectedStyle);
      setPrompt(enhanced);
      setIsEnhancing(false);
    }, 400);
  };

  // Random Inspiration Dice
  const handleRandomPrompt = () => {
    const random = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    setPrompt(random.prompt);
    setSelectedStyle(random.style);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim(), selectedStyle, sceneCount, aspectRatio);
  };

  // Playback control
  const handleTogglePlay = () => {
    if (isPlaying) {
      if (audioStopperRef.current) audioStopperRef.current.stop();
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
      ambientSoundtrack.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (!isMuted) ambientSoundtrack.playMood(currentProject.bgMusic);
      playScene(activeSceneIdx);
    }
  };

  const playScene = (idx: number) => {
    const sc = currentProject.scenes[idx];
    if (!sc) return;

    if (audioStopperRef.current) audioStopperRef.current.stop();
    if (!isMuted) {
      audioStopperRef.current = speakNarration(sc.narration);
    }

    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    sceneTimerRef.current = setTimeout(() => {
      if (idx < currentProject.scenes.length - 1) {
        setActiveSceneIdx(idx + 1);
        playScene(idx + 1);
      } else {
        setIsPlaying(false);
      }
    }, (sc.duration || 5) * 1000);
  };

  const getMotionStyle = (motion: CameraMotion) => {
    const durationSec = currentScene?.duration || 5;
    const styleObj: React.CSSProperties = {
      transition: `transform ${durationSec}s cubic-bezier(0.25, 1, 0.5, 1)`,
    };

    if (!isPlaying) return { transform: 'scale(1.0)', transition: 'none' };

    switch (motion) {
      case 'zoom-in': return { transform: 'scale(1.22)', ...styleObj };
      case 'zoom-out': return { transform: 'scale(1.0)', ...styleObj };
      case 'pan-left': return { transform: 'scale(1.18) translateX(-5%)', ...styleObj };
      case 'pan-right': return { transform: 'scale(1.18) translateX(5%)', ...styleObj };
      case 'pan-up': return { transform: 'scale(1.18) translateY(-5%)', ...styleObj };
      case 'drift':
      default: return { transform: 'scale(1.12) rotate(0.6deg)', ...styleObj };
    }
  };

  const getAspectClass = () => {
    switch (currentProject.aspectRatio) {
      case '9:16': return 'max-w-xs aspect-[9/16]';
      case '1:1': return 'max-w-md aspect-square';
      case '16:9':
      default: return 'w-full aspect-video';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Leonardo.ai-style Studio Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-pink-200/90 bg-white/80 p-4 shadow-sm shadow-pink-500/5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-purple-100/80 px-3 py-1.5 text-xs font-black text-purple-900 ring-1 ring-purple-300">
            <Sparkles className="h-4 w-4 text-pink-600" />
            <span>Model: Hailuo-03 Motion Engine (MiniMax x Ahadu)</span>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
            ⚡ Unlimited Generations (0 Credits)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
          <span>{historyProjects.length} Generated Videos</span>
        </div>
      </div>

      {/* Main Studio Workspace: Left Controls (Leonardo Parameters) + Right Video Feed */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Control Panel (Leonardo Sidebar) */}
        <div className="space-y-5 lg:col-span-5">
          <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-5 shadow-xl shadow-pink-500/5 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Prompt Box with Leonardo Magic Prompt Enhancer */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-purple-950">
                    Prompt Input
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleEnhancePrompt}
                      disabled={!prompt.trim() || isEnhancing || isGenerating}
                      className="flex items-center gap-1 rounded-lg border border-pink-200 bg-pink-50 px-2.5 py-1 text-[11px] font-bold text-pink-700 transition-colors hover:bg-pink-100 disabled:opacity-50"
                      title="Leonardo Magic Prompt: Expands prompt with cinematic lighting and camera details"
                    >
                      <Sparkles className={`h-3 w-3 ${isEnhancing ? 'animate-spin' : ''}`} />
                      <span>{isEnhancing ? 'Enhancing...' : '✨ Enhance Prompt'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRandomPrompt}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-purple-200 bg-purple-50 text-purple-700 transition-colors hover:bg-purple-100"
                      title="Random Story Idea"
                    >
                      <Dice5 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your animated scene (e.g. A young Habesha boy finds a glowing coffee tree under the starry highlands...)"
                  className="w-full resize-none rounded-2xl border border-pink-200 bg-purple-50/40 p-3.5 text-xs font-medium text-purple-950 placeholder-purple-400 focus:bg-white focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/40"
                />
              </div>

              {/* Style Presets */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-purple-950">
                  Animation Style Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ART_STYLES.map((st) => {
                    const isSelected = selectedStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStyle(st.id)}
                        className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 text-purple-950 font-bold ring-2 ring-pink-400/40'
                            : 'border-pink-100 bg-white/80 text-purple-800 hover:bg-pink-50/50'
                        }`}
                      >
                        <img
                          src={st.previewImage}
                          alt={st.name}
                          className="h-9 w-9 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs truncate">{st.name}</span>
                          <span className="block text-[10px] text-pink-600 font-serif truncate">
                            {st.amharicName}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Camera Motion & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-purple-950">Camera Motion</label>
                  <select
                    value={selectedMotion}
                    onChange={(e) => setSelectedMotion(e.target.value as CameraMotion)}
                    className="w-full rounded-xl border border-pink-200 bg-white p-2 text-xs font-bold text-purple-900 focus:outline-none"
                  >
                    {CAMERA_MOTIONS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-purple-950">Aspect Ratio</label>
                  <div className="flex rounded-xl border border-pink-200 bg-purple-50/50 p-0.5">
                    <button
                      type="button"
                      onClick={() => setAspectRatio('16:9')}
                      className={`flex flex-1 items-center justify-center py-1.5 text-xs font-bold rounded-lg transition-all ${
                        aspectRatio === '16:9' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow' : 'text-purple-700'
                      }`}
                      title="16:9 Landscape"
                    >
                      <Monitor className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio('9:16')}
                      className={`flex flex-1 items-center justify-center py-1.5 text-xs font-bold rounded-lg transition-all ${
                        aspectRatio === '9:16' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow' : 'text-purple-700'
                      }`}
                      title="9:16 Portrait"
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio('1:1')}
                      className={`flex flex-1 items-center justify-center py-1.5 text-xs font-bold rounded-lg transition-all ${
                        aspectRatio === '1:1' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow' : 'text-purple-700'
                      }`}
                      title="1:1 Square"
                    >
                      <Square className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Generate Button (Leonardo Hailuo-03 Style) */}
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 py-3.5 text-sm font-black text-white shadow-xl shadow-purple-500/25 transition-all hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Hailuo-03 Generating Video ({generationProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    <span>Generate Video with Hailuo-03</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Main Area: Featured Video Player + Leonardo Generation History Feed */}
        <div className="space-y-6 lg:col-span-7">
          {/* Active Featured Video Canvas */}
          <div className="relative overflow-hidden rounded-3xl border border-pink-200/90 bg-white/90 p-5 shadow-xl shadow-pink-500/5 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
                  Featured Animation • Hailuo-03
                </span>
                <h3 className="text-base font-black text-purple-950 sm:text-lg">{currentProject.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenExport}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow transition-transform hover:scale-105 active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download MP4</span>
                </button>
                <button
                  onClick={onOpenCinema}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-pink-200 bg-white text-purple-700 hover:bg-pink-50"
                  title="Fullscreen Cinema"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Video Screen */}
            <div className="mx-auto flex justify-center">
              <div className={`relative overflow-hidden rounded-2xl border-2 border-pink-200 bg-black shadow-2xl ${getAspectClass()}`}>
                <img
                  key={currentScene?.id}
                  src={currentScene?.imageUrl}
                  alt={currentScene?.title}
                  style={getMotionStyle(currentScene?.motionType || 'zoom-in')}
                  className="h-full w-full object-cover"
                />

                <div className="pointer-events-none absolute inset-0 bg-radial-gradient" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

                {/* Subtitles Overlay */}
                {currentScene?.narration && (
                  <div className="absolute bottom-14 left-1/2 z-20 w-11/12 -translate-x-1/2">
                    <div className="rounded-xl border border-pink-400/30 bg-black/85 px-4 py-2 text-center backdrop-blur-md shadow-2xl">
                      <p className="text-xs font-bold leading-relaxed text-zinc-100 sm:text-sm">
                        {currentScene.narration}
                      </p>
                    </div>
                  </div>
                )}

                {/* Video Controls Bar */}
                <div className="absolute bottom-0 z-30 flex w-full items-center justify-between bg-gradient-to-t from-black/95 to-transparent px-3 py-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white"
                  >
                    {isMuted ? <VolumeX className="h-3.5 w-3.5 text-pink-400" /> : <Volume2 className="h-3.5 w-3.5 text-purple-300" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTogglePlay}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-md shadow-purple-500/30"
                    >
                      {isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
                    </button>
                    <button
                      onClick={() => {
                        setActiveSceneIdx(0);
                        playScene(0);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-pink-300">
                    Scene {activeSceneIdx + 1}/{currentProject.scenes.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Leonardo.ai-style Generation History Gallery Feed */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-black text-purple-950 uppercase tracking-wider">
                Generation Feed (የቪዲዮ ማህደር)
              </h4>
              <span className="text-xs font-bold text-pink-600">
                {historyProjects.length} Videos Available
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Leonardo-style Active Rendering Card when generating */}
              {isGenerating && (
                <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-dashed border-pink-400 bg-gradient-to-br from-pink-50 to-purple-50 p-5 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500 text-white animate-spin">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-purple-950">Generating Video...</span>
                      <p className="text-[11px] font-semibold text-pink-700">{generationStatus}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-purple-200">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-purple-800">{generationProgress}% complete</span>
                  </div>
                </div>
              )}

              {/* Feed of Videos */}
              {historyProjects.map((proj) => {
                const isSelected = proj.id === currentProject.id;
                return (
                  <div
                    key={proj.id}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border p-3 transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-white ring-2 ring-pink-400/40 shadow-md'
                        : 'border-pink-200/80 bg-white/80 hover:border-pink-300 hover:bg-white'
                    }`}
                  >
                    <div
                      onClick={() => onSelectProject(proj)}
                      className="relative aspect-video w-full overflow-hidden rounded-xl bg-black cursor-pointer"
                    >
                      <img
                        src={proj.scenes[0]?.imageUrl}
                        alt={proj.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg">
                          <Play className="h-5 w-5 fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                        {proj.scenes.length} Scenes • ~{proj.scenes.length * 5}s
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-black text-purple-950 truncate">{proj.title}</h5>
                        <p className="text-[10px] text-purple-600 truncate">{proj.prompt}</p>
                      </div>

                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => {
                            onSelectProject(proj);
                            onOpenExport();
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100"
                          title="Download Video File"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        {historyProjects.length > 1 && (
                          <button
                            onClick={() => onDeleteProject(proj.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-purple-300 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
