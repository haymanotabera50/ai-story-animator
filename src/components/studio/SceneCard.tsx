'use client';

import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  RefreshCw,
  Camera,
  Clock,
  Trash2,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Compass,
} from 'lucide-react';
import { StoryScene, CameraMotion, ArtStyle } from '@/types/animation';
import { CAMERA_MOTIONS } from '@/lib/constants';
import { generateImageUrl } from '@/lib/image-generator';
import { speakNarration } from '@/lib/audio-engine';

interface SceneCardProps {
  scene: StoryScene;
  artStyle: ArtStyle;
  onUpdate: (updated: StoryScene) => void;
  onDelete: (id: string) => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  artStyle,
  onUpdate,
  onDelete,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRegeneratingImg, setIsRegeneratingImg] = useState(false);
  const [audioStopper, setAudioStopper] = useState<{ stop: () => void } | null>(null);

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      audioStopper?.stop();
      setIsPlayingAudio(false);
      setAudioStopper(null);
    } else {
      setIsPlayingAudio(true);
      const stopper = speakNarration(scene.narration, () => {
        setIsPlayingAudio(false);
        setAudioStopper(null);
      });
      setAudioStopper(stopper);
    }
  };

  const handleRegenerateImage = () => {
    setIsRegeneratingImg(true);
    const newSeed = Math.floor(Math.random() * 900000);
    const newUrl = generateImageUrl(scene.visualPrompt, artStyle, '16:9', newSeed);

    setTimeout(() => {
      onUpdate({ ...scene, imageUrl: newUrl });
      setIsRegeneratingImg(false);
    }, 600);
  };

  const getMotionIcon = (m: CameraMotion) => {
    switch (m) {
      case 'zoom-in':
        return <ZoomIn className="h-3.5 w-3.5" />;
      case 'zoom-out':
        return <ZoomOut className="h-3.5 w-3.5" />;
      case 'pan-left':
        return <ArrowLeft className="h-3.5 w-3.5" />;
      case 'pan-right':
        return <ArrowRight className="h-3.5 w-3.5" />;
      case 'pan-up':
        return <ArrowUp className="h-3.5 w-3.5" />;
      case 'drift':
      default:
        return <Compass className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-pink-200/90 bg-white/90 p-4 shadow-md shadow-pink-500/5 transition-all hover:border-pink-300 hover:shadow-pink-500/10">
      {/* Top Header Bar */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-xs font-black text-pink-700">
            {scene.order}
          </span>
          <input
            type="text"
            value={scene.title}
            onChange={(e) => onUpdate({ ...scene, title: e.target.value })}
            className="rounded-lg bg-transparent px-1.5 py-0.5 text-sm font-bold text-purple-950 hover:bg-pink-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
        </div>

        <button
          onClick={() => onDelete(scene.id)}
          className="text-purple-300 transition-colors hover:text-red-500"
          title="Delete scene"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Image Preview */}
      <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-2xl bg-purple-100">
        <img
          src={scene.imageUrl}
          alt={scene.title}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            scene.motionType === 'zoom-in'
              ? 'hover:scale-110'
              : scene.motionType === 'pan-right'
              ? 'hover:translate-x-3'
              : 'hover:scale-105'
          } ${isRegeneratingImg ? 'opacity-40 animate-pulse' : ''}`}
        />

        {/* Camera motion pill */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
          {getMotionIcon(scene.motionType)}
          <span className="capitalize">{scene.motionType.replace('-', ' ')}</span>
        </div>

        {/* Regenerate image button */}
        <button
          onClick={handleRegenerateImage}
          disabled={isRegeneratingImg}
          className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-xl bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600"
          title="Regenerate scene illustration for free"
        >
          <RefreshCw className={`h-3 w-3 ${isRegeneratingImg ? 'animate-spin' : ''}`} />
          <span>New Art (Free)</span>
        </button>
      </div>

      {/* Narration editor */}
      <div className="mb-3 flex-1">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-bold text-purple-900">Voice Narration (የተራኪው ድምፅ)</label>
          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-1 text-xs font-bold transition-colors ${
              isPlayingAudio ? 'text-pink-600' : 'text-purple-600 hover:text-pink-600'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span>Hear Voice</span>
              </>
            )}
          </button>
        </div>
        <textarea
          rows={3}
          value={scene.narration}
          onChange={(e) => onUpdate({ ...scene, narration: e.target.value })}
          className="w-full resize-none rounded-xl border border-pink-200 bg-purple-50/40 p-2.5 text-xs font-medium text-purple-950 placeholder-purple-400 focus:bg-white focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
          placeholder="What does the narrator say in this scene?"
        />
      </div>

      {/* Controls: Camera & Duration */}
      <div className="grid grid-cols-2 gap-2 border-t border-pink-100 pt-3 text-xs">
        <div>
          <label className="mb-1 flex items-center gap-1 text-[11px] font-bold text-purple-800">
            <Camera className="h-3 w-3 text-pink-500" />
            Motion
          </label>
          <select
            value={scene.motionType}
            onChange={(e) => onUpdate({ ...scene, motionType: e.target.value as CameraMotion })}
            className="w-full rounded-lg border border-pink-200 bg-white px-2 py-1.5 text-xs font-semibold text-purple-900 focus:border-pink-400 focus:outline-none shadow-sm"
          >
            {CAMERA_MOTIONS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1 text-[11px] font-bold text-purple-800">
            <Clock className="h-3 w-3 text-purple-500" />
            Duration
          </label>
          <select
            value={scene.duration}
            onChange={(e) => onUpdate({ ...scene, duration: Number(e.target.value) })}
            className="w-full rounded-lg border border-pink-200 bg-white px-2 py-1.5 text-xs font-semibold text-purple-900 focus:border-pink-400 focus:outline-none shadow-sm"
          >
            <option value={4}>4 seconds</option>
            <option value={5}>5 seconds</option>
            <option value={6}>6 seconds</option>
            <option value={8}>8 seconds</option>
          </select>
        </div>
      </div>
    </div>
  );
};
