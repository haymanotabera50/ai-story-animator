'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Film,
  Sparkles,
} from 'lucide-react';
import { StoryScene, BgMusicMood, CameraMotion, AspectRatio } from '@/types/animation';
import { speakNarration, ambientSoundtrack } from '@/lib/audio-engine';
import { EthiopianCross } from '@/components/common/EthiopianCross';

interface EmbeddedVideoPlayerProps {
  scenes: StoryScene[];
  bgMusic: BgMusicMood;
  title: string;
  aspectRatio: AspectRatio;
  onOpenCinema: () => void;
  onOpenExport: () => void;
  autoPlayTrigger?: number; // increments when a new story is generated
}

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({
  scenes,
  bgMusic,
  title,
  aspectRatio,
  onOpenCinema,
  onOpenExport,
  autoPlayTrigger = 0,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioStopperRef = useRef<{ stop: () => void } | null>(null);
  const sceneTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  const currentScene = scenes[currentIdx] || scenes[0];

  // Auto-play whenever a new story is created
  useEffect(() => {
    if (autoPlayTrigger > 0 && scenes.length > 0) {
      setCurrentIdx(0);
      setIsPlaying(true);
      setHasStarted(true);
      if (!isMuted) {
        ambientSoundtrack.playMood(bgMusic);
      }
    }
  }, [autoPlayTrigger]);

  // Handle scene playback changes
  useEffect(() => {
    if (!isPlaying || !currentScene) return;

    setSceneProgress(0);
    const duration = currentScene.duration || 5;
    const intervalMs = 50;
    const totalSteps = (duration * 1000) / intervalMs;
    let step = 0;

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      step++;
      setSceneProgress(Math.min(100, (step / totalSteps) * 100));
    }, intervalMs);

    if (audioStopperRef.current) {
      audioStopperRef.current.stop();
    }

    if (!isMuted) {
      audioStopperRef.current = speakNarration(currentScene.narration);
    }

    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    sceneTimerRef.current = setTimeout(() => {
      if (currentIdx < scenes.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, duration * 1000);

    return () => {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIdx, isPlaying, isMuted, currentScene]);

  const cleanupPlayback = () => {
    if (audioStopperRef.current) {
      audioStopperRef.current.stop();
      audioStopperRef.current = null;
    }
    if (sceneTimerRef.current) {
      clearTimeout(sceneTimerRef.current);
      sceneTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    ambientSoundtrack.stop();
  };

  const handleTogglePlay = () => {
    setHasStarted(true);
    if (isPlaying) {
      cleanupPlayback();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (!isMuted) ambientSoundtrack.playMood(bgMusic);
    }
  };

  const handleRestart = () => {
    cleanupPlayback();
    setCurrentIdx(0);
    setIsPlaying(true);
    setHasStarted(true);
    if (!isMuted) ambientSoundtrack.playMood(bgMusic);
  };

  const handleNext = () => {
    if (currentIdx < scenes.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      ambientSoundtrack.stop();
      if (audioStopperRef.current) audioStopperRef.current.stop();
    } else {
      ambientSoundtrack.playMood(bgMusic);
      if (currentScene && isPlaying) {
        audioStopperRef.current = speakNarration(currentScene.narration);
      }
    }
  };

  if (!currentScene) return null;

  const getMotionStyle = (motion: CameraMotion) => {
    const durationSec = currentScene.duration || 5;
    const styleObj: React.CSSProperties = {
      transition: `transform ${durationSec}s cubic-bezier(0.25, 1, 0.5, 1)`,
    };

    if (!isPlaying) {
      return { transform: 'scale(1.0)', transition: 'none' };
    }

    switch (motion) {
      case 'zoom-in':
        return { transform: 'scale(1.22)', ...styleObj };
      case 'zoom-out':
        return { transform: 'scale(1.0)', ...styleObj };
      case 'pan-left':
        return { transform: 'scale(1.18) translateX(-5%)', ...styleObj };
      case 'pan-right':
        return { transform: 'scale(1.18) translateX(5%)', ...styleObj };
      case 'pan-up':
        return { transform: 'scale(1.18) translateY(-5%)', ...styleObj };
      case 'drift':
      default:
        return { transform: 'scale(1.12) rotate(0.6deg)', ...styleObj };
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'max-w-sm aspect-[9/16]';
      case '1:1':
        return 'max-w-lg aspect-square';
      case '16:9':
      default:
        return 'w-full aspect-video';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
      {/* Player Header Bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Ahadu Live Animation Screen (የቀጥታ አኒሜሽን)
              </span>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                ● Video Ready
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white sm:text-xl">{title}</h2>
          </div>
        </div>

        {/* Master action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-2 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 sm:text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Download Video File (Free)</span>
          </button>

          <button
            onClick={onOpenCinema}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 transition-colors hover:border-amber-500 hover:text-white"
            title="Open Fullscreen Cinema Theater"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Video Canvas / Player Container */}
      <div className="mx-auto flex justify-center">
        <div
          ref={containerRef}
          className={`relative overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl ${getAspectClass()}`}
        >
          {/* Top Segmented Scene Progress */}
          <div className="absolute top-0 z-30 flex w-full flex-col bg-gradient-to-b from-black/80 to-transparent p-3.5">
            <div className="flex items-center gap-1.5">
              {scenes.map((s, idx) => (
                <div key={s.id} className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full bg-amber-400 transition-all"
                    style={{
                      width:
                        idx < currentIdx
                          ? '100%'
                          : idx === currentIdx
                          ? `${sceneProgress}%`
                          : '0%',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-300">
              <span className="font-semibold text-amber-400">
                Scene {currentIdx + 1} of {scenes.length}: {currentScene.title}
              </span>
              <span className="font-mono text-zinc-400 font-serif">ቅኝት: {bgMusic}</span>
            </div>
          </div>

          {/* Animation Visual Frame */}
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-zinc-950">
            <img
              key={currentScene.id}
              src={currentScene.imageUrl}
              alt={currentScene.title}
              style={getMotionStyle(currentScene.motionType)}
              className="h-full w-full object-cover"
            />

            {/* Cinematic Vignette */}
            <div className="pointer-events-none absolute inset-0 bg-radial-gradient" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

            {/* Click to Play Overlay if not yet started */}
            {!isPlaying && !hasStarted && (
              <button
                onClick={handleTogglePlay}
                className="group absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all hover:bg-black/30"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-2xl shadow-amber-500/40 transition-transform group-hover:scale-110">
                  <Play className="h-8 w-8 fill-zinc-950 ml-1" />
                </div>
                <span className="mt-3 text-sm font-bold text-white drop-shadow">
                  Click to Play Video with Sound (ተጫወት)
                </span>
              </button>
            )}

            {/* Subtitles Box */}
            {currentScene.narration && (
              <div className="absolute bottom-16 left-1/2 z-20 w-11/12 -translate-x-1/2 sm:w-4/5">
                <div className="rounded-xl border border-white/10 bg-black/80 px-4 py-2.5 text-center backdrop-blur-md shadow-2xl">
                  <p className="text-xs font-semibold leading-relaxed text-zinc-100 sm:text-sm">
                    {currentScene.narration}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Player Controller Bar */}
          <div className="absolute bottom-0 z-30 flex w-full items-center justify-between bg-gradient-to-t from-black/95 to-transparent px-4 py-2.5">
            <button
              onClick={handleToggleMute}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/30 transition-transform hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-zinc-950" /> : <Play className="h-5 w-5 fill-zinc-950 ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIdx === scenes.length - 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={onOpenCinema}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
              title="Fullscreen Cinema"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
