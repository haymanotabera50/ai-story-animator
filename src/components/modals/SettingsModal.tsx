'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Check, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('STORY_GEMINI_KEY') || '';
      setGeminiKey(stored);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      if (geminiKey.trim()) {
        localStorage.setItem('STORY_GEMINI_KEY', geminiKey.trim());
      } else {
        localStorage.removeItem('STORY_GEMINI_KEY');
      }
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 700);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Studio Settings</h3>
            <p className="text-xs text-zinc-400">Configure AI generation keys</p>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-xs text-zinc-300">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 shrink-0 text-purple-400 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-300">Ready Out-Of-The-Box</p>
              <p className="mt-1 text-zinc-400 leading-relaxed">
                By default, StoryMorph uses its built-in Creative Director engine and high-res image generation. You can optionally add a Google Gemini API key below for custom LLM scriptwriting.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              Stored locally in your browser. Never uploaded to third-party servers.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

