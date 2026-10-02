'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { StoryScene, BgMusicMood, CameraMotion } from '@/types/animation';
import { speakNarration, ambientSoundtrack } from '@/lib/audio-engine';

interface CinemaPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: StoryScene[];
  bgMusic: BgMusicMood;
  title: string;
}

export const CinemaPlayerModal: React.FC<CinemaPlayerModalProps> = ({
  isOpen,
  onClose,
  scenes,
  bgMusic,
  title,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioStopperRef = useRef<{ stop: () => void } | null>(null);
  const sceneTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  const currentScene = scenes[currentIdx];

  // Start playback when opened
  useEffect(() => {
    if (isOpen && scenes.length > 0) {
      setCurrentIdx(0);
      setIsPlaying(true);
      if (!isMuted) {
        ambientSoundtrack.playMood(bgMusic);
      }
    } else {
      cleanupPlayback();
    }
    return () => {
      cleanupPlayback();
    };
  }, [isOpen]);

  // Handle scene playback changes
  useEffect(() => {
    if (!isOpen || !isPlaying || !currentScene) return;

    // Reset progress
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

    // Speak narration
    if (audioStopperRef.current) {
      audioStopperRef.current.stop();
    }

    if (!isMuted) {
      audioStopperRef.current = speakNarration(
        currentScene.narration,
        () => {
          // Voice ended
        }
      );
    }

    // Advance scene when time completes
    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    sceneTimerRef.current = setTimeout(() => {
      if (currentIdx < scenes.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        // Story finished
        setIsPlaying(false);
      }
    }, duration * 1000);

    return () => {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIdx, isPlaying, isOpen, isMuted]);

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

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen || !currentScene) return null;

  // Determine dynamic motion CSS
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div
        ref={containerRef}
        className="relative flex h-full w-full flex-col overflow-hidden bg-black lg:max-h-[90vh] lg:max-w-6xl lg:rounded-3xl lg:border lg:border-zinc-800"
      >
        {/* Top Header / Progress Bar */}
        <div className="absolute top-0 z-30 flex w-full flex-col bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6">
          {/* Segmented Scene Progress Bar */}
          <div className="mb-4 flex items-center gap-1.5">
            {scenes.map((s, idx) => (
              <div
                key={s.id}
                className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/20"
              >
                <div
                  className="h-full bg-white transition-all"
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

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Scene {currentIdx + 1} of {scenes.length} • {currentScene.title}
              </span>
              <h2 className="text-lg font-bold text-white drop-shadow">{title}</h2>
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Animation Cinema Screen */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-zinc-950">
          <img
            key={currentScene.id}
            src={currentScene.imageUrl}
            alt={currentScene.title}
            style={getMotionStyle(currentScene.motionType)}
            className="h-full w-full object-cover"
          />

          {/* Vignette Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-radial-gradient" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />

          {/* Subtitles Box */}
          {currentScene.narration && (
            <div className="absolute bottom-24 left-1/2 z-20 w-11/12 -translate-x-1/2 sm:w-4/5 lg:w-3/5">
              <div className="rounded-2xl border border-white/10 bg-black/75 px-6 py-4 text-center backdrop-blur-md shadow-2xl">
                <p className="text-base font-medium leading-relaxed text-zinc-100 sm:text-lg">
                  {currentScene.narration}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Playback Control Bar */}
        <div className="absolute bottom-0 z-30 flex w-full items-center justify-between bg-gradient-to-t from-black/90 to-transparent p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-5 w-5 text-red-400" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 disabled:opacity-30"
              title="Previous scene"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-950 shadow-lg shadow-white/20 transition-all hover:scale-105 active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-6 w-6 fill-zinc-950" /> : <Play className="h-6 w-6 fill-zinc-950" />}
            </button>

            <button
              onClick={handleRestart}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              title="Restart animation"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIdx === scenes.length - 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 disabled:opacity-30"
              title="Next scene"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFullscreen}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

