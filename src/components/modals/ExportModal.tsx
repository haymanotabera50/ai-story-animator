'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Film, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StoryScene } from '@/types/animation';
import { renderStoryToVideo, RenderProgress } from '@/lib/video-renderer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: StoryScene[];
  title: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  scenes,
  title,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<RenderProgress>({
    currentScene: 0,
    totalScenes: scenes.length,
    progressPercent: 0,
    statusText: 'Preparing Ahadu video engine...',
  });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !isExporting && !downloadUrl) {
      startExport();
    }
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [isOpen]);

  const startExport = async () => {
    setIsExporting(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const videoBlob = await renderStoryToVideo(scenes, (p) => {
        setProgress(p);
      });

      const url = URL.createObjectURL(videoBlob);
      setDownloadUrl(url);
      setIsExporting(false);

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#c084fc', '#a855f7', '#fb7185', '#ffffff'],
        });
      } catch {}

      const safeFilename = `ahadu_${title.toLowerCase().replace(/[^a-z0-9]/gi, '_') || 'story'}_animation.webm`;
      const a = document.createElement('a');
      a.href = url;
      a.download = safeFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err?.message || 'Failed to render animation video.');
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/40 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-pink-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-purple-400 hover:bg-pink-50 hover:text-purple-950"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 ring-1 ring-pink-300">
            {isExporting ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : downloadUrl ? (
              <CheckCircle className="h-7 w-7 text-emerald-500" />
            ) : (
              <Film className="h-7 w-7" />
            )}
          </div>

          <h3 className="text-lg font-black text-purple-950">
            {isExporting
              ? 'Rendering Ahadu Video (Free)'
              : downloadUrl
              ? 'Animation Downloaded! (እንኳን ደስ አለዎት)'
              : 'Export Video'}
          </h3>
          <p className="mt-1 text-xs font-medium text-purple-700/80">
            {isExporting
              ? progress.statusText
              : downloadUrl
              ? 'Your high-definition animated video has been downloaded directly to your device.'
              : 'Preparing client-side video compositor...'}
          </p>

          {/* Progress Bar */}
          {isExporting && (
            <div className="mt-6 w-full space-y-2">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-purple-100">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 transition-all duration-300"
                  style={{ width: `${progress.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-purple-600">
                <span>{progress.progressPercent}%</span>
                <span>
                  Scene {progress.currentScene} of {progress.totalScenes}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 ring-1 ring-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex w-full gap-3">
            {downloadUrl ? (
              <>
                <a
                  href={downloadUrl}
                  download={`ahadu_${title.toLowerCase().replace(/[^a-z0-9]/gi, '_') || 'story'}_animation.webm`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition-transform hover:opacity-95 active:scale-98"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Again</span>
                </a>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm font-bold text-purple-800 shadow-sm transition-colors hover:bg-pink-50"
                >
                  Done
                </button>
              </>
            ) : isExporting ? (
              <button
                onClick={onClose}
                className="w-full rounded-xl border border-pink-200 bg-white py-2.5 text-xs font-bold text-purple-700 hover:bg-pink-50"
              >
                Cancel Export
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
