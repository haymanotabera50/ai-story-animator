'use client';

import React, { useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { PromptSection } from '@/components/studio/PromptSection';
import { TimelineEditor } from '@/components/studio/TimelineEditor';
import { EmbeddedVideoPlayer } from '@/components/player/EmbeddedVideoPlayer';
import { CinemaPlayerModal } from '@/components/player/CinemaPlayerModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { StoryProject, StoryScene, ArtStyle, BgMusicMood, AspectRatio } from '@/types/animation';
import { generateImageUrl } from '@/lib/image-generator';

const INITIAL_PROJECT: StoryProject = {
  id: 'starter-kaldi',
  title: 'The Legend of Kaldi & Coffee',
  prompt: 'A young Ethiopian shepherd boy named Kaldi in ancient Kaffa discovers his lively goats dancing with joy under wild coffee trees with glowing red cherries.',
  style: 'habesha-3d',
  aspectRatio: '16:9',
  bgMusic: 'tizita',
  createdAt: new Date().toISOString(),
  scenes: [
    {
      id: 'sc-1',
      order: 1,
      title: 'The Highlands of Kaffa (የካፋ ተራሮች)',
      narration: 'Deep in the lush highland misty forests of ancient Kaffa, a young Ethiopian shepherd boy named Kaldi tended his herd beneath warm golden sunbeams.',
      visualPrompt: 'Establishing wide shot of a young Ethiopian boy shepherd in lush green highland ridges of Kaffa',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1024&q=80',
      motionType: 'zoom-in',
      duration: 5,
      soundtrackMood: 'tizita',
    },
    {
      id: 'sc-2',
      order: 2,
      title: 'The Secret Red Berries (ቀያይ ፍሬዎች)',
      narration: 'Among the wild forest trees, he discovered mysterious bushes bearing bright crimson berries that sparkled like rubies in the morning light.',
      visualPrompt: 'Close up of wild coffee trees with glowing vibrant red cherries',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1024&q=80',
      motionType: 'pan-right',
      duration: 5,
      soundtrackMood: 'tizita',
    },
    {
      id: 'sc-3',
      order: 3,
      title: 'The Dance of Pure Joy (የፍስሐ ጭፈራ)',
      narration: 'After chewing the sweet cherries, the goats leaped and danced across the meadows with boundless joy, discovering the magical gift of Ethiopian coffee.',
      visualPrompt: 'Heartwarming playful scene of joyous animals in flowered Ethiopian mountain meadow with young Kaldi laughing',
      imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1024&q=80',
      motionType: 'zoom-out',
      duration: 6,
      soundtrackMood: 'tizita',
    },
  ],
};

export default function HomePage() {
  const [project, setProject] = useState<StoryProject>(INITIAL_PROJECT);
  const [isLoading, setIsLoading] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [autoPlayTrigger, setAutoPlayTrigger] = useState(0);

  const videoPlayerRef = useRef<HTMLDivElement>(null);

  const handleGenerateStory = async (
    prompt: string,
    style: ArtStyle,
    sceneCount: number,
    aspectRatio: AspectRatio
  ) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const storedKey =
        typeof window !== 'undefined'
          ? localStorage.getItem('STORY_GEMINI_KEY') || ''
          : '';

      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style,
          sceneCount,
          apiKey: storedKey || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate story.');
      }

      setProject({
        id: `story-${Date.now()}`,
        title: data.story.title,
        prompt,
        style,
        aspectRatio,
        bgMusic: data.story.bgMusic || 'tizita',
        scenes: data.story.scenes,
        createdAt: new Date().toISOString(),
      });

      // Trigger automatic video playback and scroll to player
      setAutoPlayTrigger((prev) => prev + 1);

      setTimeout(() => {
        videoPlayerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Something went wrong while generating the story.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateScene = (updated: StoryScene) => {
    setProject((prev) => ({
      ...prev,
      scenes: prev.scenes.map((s) => (s.id === updated.id ? updated : s)),
    }));
  };

  const handleDeleteScene = (id: string) => {
    setProject((prev) => {
      const filtered = prev.scenes.filter((s) => s.id !== id);
      const renumbered = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
      return { ...prev, scenes: renumbered };
    });
  };

  const handleAddScene = () => {
    setProject((prev) => {
      const nextOrder = prev.scenes.length + 1;
      const seed = Math.floor(Math.random() * 900000);
      const newScene: StoryScene = {
        id: `sc-${Date.now()}`,
        order: nextOrder,
        title: `Chapter ${nextOrder}: New Horizon (አዲስ ምዕራፍ)`,
        narration: 'And beneath the vast starlit sky of the highlands, the legend continued to flourish...',
        visualPrompt: `Cinematic wide view, chapter ${nextOrder} of ${prev.prompt}`,
        imageUrl: generateImageUrl(
          `Cinematic wide view, chapter ${nextOrder} of ${prev.prompt}`,
          prev.style,
          prev.aspectRatio,
          seed
        ),
        motionType: 'zoom-in',
        duration: 5,
        soundtrackMood: prev.bgMusic,
      };

      return {
        ...prev,
        scenes: [...prev.scenes, newScene],
      };
    });
  };

  const handleUpdateTitle = (title: string) => {
    setProject((prev) => ({ ...prev, title }));
  };

  const handleUpdateBgMusic = (bgMusic: BgMusicMood) => {
    setProject((prev) => ({ ...prev, bgMusic }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50/50 to-rose-50 text-purple-950 selection:bg-pink-300/40 selection:text-purple-950">
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPlayCinema={() => setIsCinemaOpen(true)}
        hasScenes={project.scenes.length > 0}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Story prompt generator */}
        <section>
          <PromptSection onGenerate={handleGenerateStory} isLoading={isLoading} />
          {errorMsg && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
              {errorMsg}
            </div>
          )}
        </section>

        {/* Embedded Video Screen: Plays immediately on generation */}
        <section ref={videoPlayerRef}>
          <EmbeddedVideoPlayer
            scenes={project.scenes}
            bgMusic={project.bgMusic}
            title={project.title}
            aspectRatio={project.aspectRatio}
            onOpenCinema={() => setIsCinemaOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            autoPlayTrigger={autoPlayTrigger}
          />
        </section>

        {/* Storyboard timeline & scene manager */}
        <section>
          <TimelineEditor
            title={project.title}
            onUpdateTitle={handleUpdateTitle}
            scenes={project.scenes}
            artStyle={project.style}
            bgMusic={project.bgMusic}
            onUpdateBgMusic={handleUpdateBgMusic}
            onUpdateScene={handleUpdateScene}
            onDeleteScene={handleDeleteScene}
            onAddScene={handleAddScene}
            onPlayCinema={() => setIsCinemaOpen(true)}
            onExportVideo={() => setIsExportOpen(true)}
          />
        </section>
      </main>

      {/* Cinema theater player modal */}
      <CinemaPlayerModal
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
        scenes={project.scenes}
        bgMusic={project.bgMusic}
        title={project.title}
        aspectRatio={project.aspectRatio}
      />

      {/* Video export dialog */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        scenes={project.scenes}
        title={project.title}
      />

      {/* Studio Settings */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
