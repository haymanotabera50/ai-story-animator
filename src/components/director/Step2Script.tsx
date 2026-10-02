'use client';

import React, { useState } from 'react';
import {
  FileText,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Camera,
  Clock,
} from 'lucide-react';
import { FullStoryScript, ScriptScene } from '@/types/director';
import { CameraMotion } from '@/types/animation';
import { CAMERA_MOTIONS } from '@/lib/constants';
import { speakNarration } from '@/lib/audio-engine';

interface Step2ScriptProps {
  script: FullStoryScript;
  onUpdateScript: (updated: FullStoryScript) => void;
  onProceed: () => void;
  onBack: () => void;
  onPolishScript: (instruction: string) => void;
}

export const Step2Script: React.FC<Step2ScriptProps> = ({
  script,
  onUpdateScript,
  onProceed,
  onBack,
  onPolishScript,
}) => {
  const [playingSceneId, setPlayingSceneId] = useState<string | null>(null);
  const audioStopperRef = React.useRef<{ stop: () => void } | null>(null);

  const handleToggleVoice = (sc: ScriptScene) => {
    if (playingSceneId === sc.id) {
      audioStopperRef.current?.stop();
      setPlayingSceneId(null);
    } else {
      setPlayingSceneId(sc.id);
      audioStopperRef.current = speakNarration(sc.narration, () => {
        setPlayingSceneId(null);
      });
    }
  };

  const handleUpdateScene = (idx: number, updated: Partial<ScriptScene>) => {
    const newScenes = [...script.scenes];
    newScenes[idx] = { ...newScenes[idx], ...updated };
    onUpdateScript({ ...script, scenes: newScenes });
  };

  const handleDeleteScene = (idx: number) => {
    if (script.scenes.length <= 2) return;
    const newScenes = script.scenes
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, order: i + 1 }));
    onUpdateScript({ ...script, scenes: newScenes });
  };

  const handleAddScene = () => {
    const nextOrder = script.scenes.length + 1;
    const newScene: ScriptScene = {
      id: `scene-${Date.now()}-${nextOrder}`,
      order: nextOrder,
      title: `Act ${nextOrder}: New Horizon (አዲስ ምዕራፍ)`,
      narration: 'And beneath the vast starlit sky of the highlands, our journey revealed a new wonder...',
      visualDirection: `Cinematic wide view continuing the adventure of ${script.title}`,
      imageUrl: script.scenes[0]?.imageUrl || '',
      cameraMotion: 'zoom-in',
      duration: 5,
    };
    onUpdateScript({ ...script, scenes: [...script.scenes, newScene] });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-6 shadow-xl shadow-pink-500/5 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-600 text-xs font-black text-white">
                2
              </span>
              <h2 className="text-lg font-black text-purple-950 sm:text-xl">
                Script & Storyboard Review (ስክሪፕት ዝግጅት)
              </h2>
            </div>
            <p className="mt-1 text-xs font-medium text-purple-700/80">
              Review and edit the voice lines and visual directions for each scene. Everything is fully customizable!
            </p>
          </div>

          {/* Quick AI Polish Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-pink-700 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              AI Tone Polish:
            </span>
            <button
              onClick={() => onPolishScript('action')}
              className="rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-xs font-bold text-pink-800 hover:bg-pink-100"
            >
              ⚡ More Action
            </button>
            <button
              onClick={() => onPolishScript('funn')}
              className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-800 hover:bg-purple-100"
            >
              😂 More Whimsical
            </button>
          </div>
        </div>
      </div>

      {/* Script Scenes Cards */}
      <div className="space-y-4">
        {script.scenes.map((scene, idx) => (
          <div
            key={scene.id}
            className="rounded-3xl border border-pink-200/90 bg-white/90 p-5 shadow-lg shadow-pink-500/5 transition-all hover:border-pink-300 sm:p-6"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-xs font-black text-pink-700">
                  {scene.order}
                </span>
                <input
                  type="text"
                  value={scene.title}
                  onChange={(e) => handleUpdateScene(idx, { title: e.target.value })}
                  className="rounded-lg bg-transparent px-2 py-0.5 text-sm font-black text-purple-950 hover:bg-pink-50 focus:bg-white focus:ring-1 focus:ring-pink-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleVoice(scene)}
                  className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition-colors ${
                    playingSceneId === scene.id
                      ? 'bg-pink-500 text-white'
                      : 'border border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100'
                  }`}
                >
                  {playingSceneId === scene.id ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Test Line</span>
                    </>
                  )}
                </button>

                {script.scenes.length > 2 && (
                  <button
                    onClick={() => handleDeleteScene(idx)}
                    className="p-1 text-purple-300 hover:text-red-500"
                    title="Delete Scene"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Narration voice line input */}
            <div className="mb-3">
              <label className="mb-1 block text-xs font-bold text-purple-900">
                Voiceover Narration (ተራኪው የሚናገረው)
              </label>
              <textarea
                rows={2}
                value={scene.narration}
                onChange={(e) => handleUpdateScene(idx, { narration: e.target.value })}
                className="w-full resize-none rounded-2xl border border-pink-200 bg-purple-50/30 p-3 text-xs font-medium text-purple-950 focus:bg-white focus:border-pink-400 focus:outline-none"
              />
            </div>

            {/* Visual Direction & Camera controls */}
            <div className="grid grid-cols-1 gap-3 border-t border-pink-100 pt-3 text-xs sm:grid-cols-12">
              <div className="sm:col-span-8">
                <label className="mb-1 block text-[11px] font-bold text-purple-800">
                  Visual Art Direction (የሥዕሉ አቅጣጫ)
                </label>
                <input
                  type="text"
                  value={scene.visualDirection}
                  onChange={(e) => handleUpdateScene(idx, { visualDirection: e.target.value })}
                  className="w-full rounded-xl border border-pink-200 bg-white p-2 text-xs font-medium text-purple-950 focus:border-pink-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-bold text-purple-800">
                  <Camera className="inline h-3 w-3 mr-1 text-pink-500" />
                  Camera
                </label>
                <select
                  value={scene.cameraMotion}
                  onChange={(e) => handleUpdateScene(idx, { cameraMotion: e.target.value as CameraMotion })}
                  className="w-full rounded-xl border border-pink-200 bg-white p-2 text-xs font-bold text-purple-900 focus:outline-none"
                >
                  {CAMERA_MOTIONS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-bold text-purple-800">
                  <Clock className="inline h-3 w-3 mr-1 text-purple-500" />
                  Duration
                </label>
                <select
                  value={scene.duration}
                  onChange={(e) => handleUpdateScene(idx, { duration: Number(e.target.value) })}
                  className="w-full rounded-xl border border-pink-200 bg-white p-2 text-xs font-bold text-purple-900 focus:outline-none"
                >
                  <option value={4}>4s</option>
                  <option value={5}>5s</option>
                  <option value={6}>6s</option>
                  <option value={8}>8s</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Scene Card */}
      <button
        onClick={handleAddScene}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50/40 p-4 text-xs font-bold text-purple-800 transition-colors hover:border-pink-500 hover:bg-pink-100/60"
      >
        <Plus className="h-4 w-4 text-pink-600" />
        <span>Add Next Scene to Script</span>
      </button>

      {/* Footer Nav Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-2xl border border-pink-200 bg-white px-5 py-3 text-xs font-bold text-purple-900 hover:bg-pink-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Ideas</span>
        </button>

        <button
          onClick={onProceed}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 px-7 py-3 text-sm font-black text-white shadow-xl shadow-purple-500/25 transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Next: Customization Studio (ወደ ምርጫዎች)</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
