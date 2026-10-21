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
  ArrowLeft,
  CheckCircle,
  Loader2,
  Cpu,
  Video,
  Clapperboard,
  Tv,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FullStoryScript, ScriptScene } from '@/types/director';
import { CameraMotion, StoryScene } from '@/types/animation';
import { speakNarration, ambientSoundtrack } from '@/lib/audio-engine';
import { renderStoryToVideo, RenderProgress } from '@/lib/video-renderer';
import { createProceduralSceneSvg } from '@/lib/visual-engine';
import { VideoParticleCanvas } from './VideoParticleCanvas';

interface Step4VideoProps {
  script: FullStoryScript;
  onBackToCustomize: () => void;
  onNewStory: () => void;
}

export const Step4Video: React.FC<Step4VideoProps> = ({
  script,
  onBackToCustomize,
  onNewStory,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [loadedImagesMap, setLoadedImagesMap] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'cinema' | 'renderedVideo'>('cinema');

  // Video Export / Render state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<RenderProgress>({
    currentScene: 0,
    totalScenes: script.scenes.length,
    progressPercent: 0,
    statusText: 'Preparing video render...',
  });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const audioStopperRef = useRef<{ stop: () => void } | null>(null);
  const sceneTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  const currentScene = script.scenes[currentIdx] || script.scenes[0];

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

  useEffect(() => {
    return () => {
      cleanupPlayback();
    };
  }, []);

  // Main playback timer loop
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

    // Trigger voice narration for the current scene
    if (audioStopperRef.current) audioStopperRef.current.stop();
    if (!isMuted) {
      audioStopperRef.current = speakNarration(currentScene.narration);
    }

    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    sceneTimerRef.current = setTimeout(() => {
      if (currentIdx < script.scenes.length - 1) {
        setCurrentIdx((p) => p + 1);
      } else {
        setIsPlaying(false);
        cleanupPlayback();
      }
    }, duration * 1000);

    return () => {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIdx, isPlaying, isMuted, currentScene]);

  // Direct user-gesture activation ensures browser doesn't block audio/speech
  const handleTogglePlay = () => {
    if (isPlaying) {
      cleanupPlayback();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (!isMuted) {
        ambientSoundtrack.playMood(script.musicMode);
        if (audioStopperRef.current) audioStopperRef.current.stop();
        audioStopperRef.current = speakNarration(currentScene.narration);
      }
    }
  };

  const handleRestart = () => {
    cleanupPlayback();
    setCurrentIdx(0);
    setIsPlaying(true);
    if (!isMuted) {
      ambientSoundtrack.playMood(script.musicMode);
      if (audioStopperRef.current) audioStopperRef.current.stop();
      audioStopperRef.current = speakNarration(script.scenes[0]?.narration || '');
    }
  };

  const handleNext = () => {
    if (currentIdx < script.scenes.length - 1) {
      setCurrentIdx((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((p) => p - 1);
    }
  };

  // Compile full video with 60fps canvas, audio, subtitles, and particles
  const handleBuildVideo = async (autoDownload: boolean = true) => {
    cleanupPlayback();
    setIsPlaying(false);
    setIsExporting(true);

    const mappedScenes: StoryScene[] = script.scenes.map((s) => ({
      id: s.id,
      order: s.order,
      title: s.title,
      narration: s.narration,
      visualPrompt: s.visualDirection,
      imageUrl: s.imageUrl,
      motionType: s.cameraMotion,
      duration: s.duration,
      soundtrackMood: script.musicMode,
    }));

    try {
      const blob = await renderStoryToVideo(mappedScenes, (p) => {
        setExportProgress(p);
      });

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsExporting(false);
      setViewMode('renderedVideo');

      try {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#c084fc', '#a855f7', '#fb7185', '#ffffff'],
        });
      } catch {}

      if (autoDownload) {
        const safeName = `ahadu_${script.title.toLowerCase().replace(/[^a-z0-9]/gi, '_') || 'animation'}.webm`;
        const a = document.createElement('a');
        a.href = url;
        a.download = safeName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error(err);
      setIsExporting(false);
    }
  };

  const getMotionStyle = (motion: CameraMotion) => {
    const durationSec = currentScene?.duration || 5;
    const styleObj: React.CSSProperties = {
      transition: `transform ${durationSec}s cubic-bezier(0.25, 1, 0.5, 1)`,
    };

    if (!isPlaying) return { transform: 'scale(1.0)', transition: 'none' };

    switch (motion) {
      case 'zoom-in':
        return { transform: 'scale(1.2)', ...styleObj };
      case 'zoom-out':
        return { transform: 'scale(1.0)', ...styleObj };
      case 'pan-left':
        return { transform: 'scale(1.15) translateX(-4%)', ...styleObj };
      case 'pan-right':
        return { transform: 'scale(1.15) translateX(4%)', ...styleObj };
      case 'pan-up':
        return { transform: 'scale(1.15) translateY(-4%)', ...styleObj };
      case 'drift':
      default:
        return { transform: 'scale(1.1) rotate(0.5deg)', ...styleObj };
    }
  };

  const getAspectClass = () => {
    switch (script.aspectRatio) {
      case '9:16':
        return 'max-w-xs aspect-[9/16]';
      case '1:1':
        return 'max-w-md aspect-square';
      case '16:9':
      default:
        return 'w-full aspect-video';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Player Mode Bar */}
      <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-5 shadow-xl shadow-pink-500/5 backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-pink-500 text-xs font-black text-white">
                4
              </span>
              <h2 className="text-lg font-black text-purple-950 sm:text-xl">
                {script.title} ({script.amharicTitle})
              </h2>
            </div>
            <p className="mt-1 text-xs font-medium text-purple-700/80">
              {script.logline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {downloadUrl && (
              <div className="flex rounded-2xl bg-purple-100/70 p-1">
                <button
                  onClick={() => setViewMode('cinema')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    viewMode === 'cinema'
                      ? 'bg-white text-purple-900 shadow-sm'
                      : 'text-purple-600 hover:text-purple-900'
                  }`}
                >
                  <Clapperboard className="h-3.5 w-3.5" />
                  <span>Cinema Stage</span>
                </button>
                <button
                  onClick={() => setViewMode('renderedVideo')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    viewMode === 'renderedVideo'
                      ? 'bg-white text-purple-900 shadow-sm'
                      : 'text-purple-600 hover:text-purple-900'
                  }`}
                >
                  <Tv className="h-3.5 w-3.5" />
                  <span>Rendered Video (MP4)</span>
                </button>
              </div>
            )}

            <button
              onClick={() => handleBuildVideo(true)}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 px-5 py-3 text-xs sm:text-sm font-black text-white shadow-xl shadow-purple-500/25 transition-all hover:opacity-95 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Encoding Video ({exportProgress.progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download Video (Free MP4)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video Render progress message if exporting */}
        {isExporting && (
          <div className="mt-4 rounded-2xl border border-pink-200 bg-pink-50/80 p-4">
            <div className="flex justify-between text-xs font-bold text-purple-950 mb-1">
              <span>{exportProgress.statusText}</span>
              <span>{exportProgress.progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-purple-100">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                style={{ width: `${exportProgress.progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Video Cinema Screen */}
      <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-5 shadow-xl shadow-pink-500/5 backdrop-blur-xl sm:p-7">
        <div className="mx-auto flex justify-center">
          <div
            className={`relative overflow-hidden rounded-2xl border-2 border-pink-300 bg-black shadow-2xl ${getAspectClass()}`}
          >
            {/* View Mode 1: Rendered Video with Native Controls */}
            {viewMode === 'renderedVideo' && downloadUrl ? (
              <video
                controls
                autoPlay
                loop
                src={downloadUrl}
                className="h-full w-full object-cover"
              />
            ) : (
              /* View Mode 2: Interactive Cinema Stage */
              <>
                {/* Top Scene Progress Segments */}
                <div className="absolute top-0 z-30 flex w-full flex-col bg-gradient-to-b from-black/85 to-transparent p-3.5">
                  <div className="flex items-center gap-1.5">
                    {script.scenes.map((s, idx) => (
                      <div
                        key={s.id}
                        className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/20"
                      >
                        <div
                          className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all"
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
                    <span className="font-bold text-pink-300">
                      Scene {currentIdx + 1} of {script.scenes.length}: {currentScene.title}
                    </span>
                    <span className="font-serif text-purple-200">ቅኝት: {script.musicMode}</span>
                  </div>
                </div>

                {/* Visual Frame */}
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-zinc-950">
                  {/* Layer 1: Instant Procedural Backdrop - guarantees zero blank screens */}
                  <img
                    src={createProceduralSceneSvg(
                      currentScene.title,
                      currentScene.narration,
                      script.style,
                      currentScene.cameraMotion
                    )}
                    alt="Procedural scene frame"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {/* Layer 2: Real AI Prompt-Generated Artwork - smoothly fades in on arrival */}
                  <img
                    key={currentScene.id}
                    src={currentScene.imageUrl}
                    alt={currentScene.title}
                    onLoad={() => {
                      setLoadedImagesMap((prev) => ({ ...prev, [currentScene.id]: true }));
                    }}
                    style={getMotionStyle(currentScene.cameraMotion)}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                      loadedImagesMap[currentScene.id] ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* AI Generating Indicator badge if still downloading */}
                  {!loadedImagesMap[currentScene.id] && (
                    <div className="absolute top-12 left-4 z-20 flex items-center gap-2 rounded-xl bg-black/75 px-3 py-1.5 backdrop-blur-md border border-pink-400/40">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-pink-400" />
                      <span className="text-[11px] font-bold text-pink-200">
                        Synthesizing AI Artwork...
                      </span>
                    </div>
                  )}

                  {/* Layer 3: Moving Particles & Volumetric Lighting */}
                  <VideoParticleCanvas isPlaying={isPlaying} styleMode={script.style} />

                  <div className="pointer-events-none absolute inset-0 bg-radial-gradient" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

                  {/* Big Play Overlay (shown when not playing) */}
                  {!isPlaying && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs p-6 text-center">
                      <button
                        onClick={handleTogglePlay}
                        className="group flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-violet-600 text-white shadow-2xl shadow-pink-500/50 transition-all hover:scale-110 active:scale-95"
                      >
                        <Play className="h-10 w-10 fill-white ml-1" />
                      </button>
                      <span className="mt-4 text-base font-black text-white tracking-wide">
                        ▶ PLAY ANIMATED VIDEO (ቪዲዮውን ጀምር)
                      </span>
                      <span className="mt-1 text-xs text-pink-200 max-w-sm">
                        Click to watch with voiceover narration and authentic Ethiopian {script.musicMode} music
                      </span>
                    </div>
                  )}

                  {/* Subtitles Box */}
                  {currentScene.narration && isPlaying && (
                    <div className="absolute bottom-16 left-1/2 z-20 w-11/12 -translate-x-1/2 sm:w-4/5">
                      <div className="rounded-xl border border-pink-400/30 bg-black/85 px-4 py-2.5 text-center backdrop-blur-md shadow-2xl">
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
                    onClick={() => setIsMuted(!isMuted)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-md"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-pink-400" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-purple-300" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={currentIdx === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white disabled:opacity-30"
                    >
                      <SkipBack className="h-4 w-4" />
                    </button>

                    <button
                      onClick={handleTogglePlay}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 fill-white" />
                      ) : (
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={handleRestart}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={currentIdx === script.scenes.length - 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white disabled:opacity-30"
                    >
                      <SkipForward className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-pink-300">
                    {currentIdx + 1} / {script.scenes.length}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hailuo-03 / Leonardo Video Engine Inspector */}
      <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-5 shadow-lg shadow-pink-500/5 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-black text-sm shadow-md shadow-pink-500/20">
              <Clapperboard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-purple-950 flex items-center gap-2">
                <span>Ahadu AI Video Engine</span>
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
                  Hailuo-03 Compatible
                </span>
              </h3>
              <p className="text-xs text-purple-600/80">
                Voiced animation generated directly from your prompt with dynamic 60fps camera motion and Ethiopian pentatonic music.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleBuildVideo(false)}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50/70 px-4 py-2.5 text-xs font-bold text-purple-900 transition-all hover:bg-purple-100"
          >
            <Tv className="h-4 w-4 text-purple-600" />
            <span>Generate Native MP4 Video File</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-pink-200/70 bg-pink-50/50 p-3">
            <span className="text-[11px] font-black text-purple-900 block">AI Scene Prompt (Generated)</span>
            <p className="mt-1 text-xs text-purple-700 line-clamp-3 italic">
              "{currentScene.visualDirection}"
            </p>
          </div>
          <div className="rounded-2xl border border-purple-200/70 bg-purple-50/50 p-3">
            <span className="text-[11px] font-black text-purple-900 block">Camera Dynamics</span>
            <span className="mt-1 inline-block rounded-xl bg-purple-200/70 px-2.5 py-1 text-xs font-bold text-purple-900 capitalize">
              🎥 {currentScene.cameraMotion} (60fps motion)
            </span>
          </div>
          <div className="rounded-2xl border border-pink-200/70 bg-pink-50/50 p-3">
            <span className="text-[11px] font-black text-purple-900 block">Ethiopian Qenet Scale</span>
            <span className="mt-1 inline-block rounded-xl bg-pink-200/70 px-2.5 py-1 text-xs font-bold text-pink-900 capitalize">
              🎵 {script.musicMode} (ቅኝት)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Nav actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBackToCustomize}
          className="flex items-center gap-2 rounded-2xl border border-pink-200 bg-white px-5 py-3 text-xs font-bold text-purple-900 hover:bg-pink-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Customization</span>
        </button>

        <button
          onClick={onNewStory}
          className="flex items-center gap-2 rounded-2xl border border-purple-200 bg-white px-5 py-3 text-xs font-bold text-purple-900 hover:bg-purple-50"
        >
          <Sparkles className="h-4 w-4 text-pink-500" />
          <span>Create Another Story (አዲስ ታሪክ)</span>
        </button>
      </div>
    </div>
  );
};
