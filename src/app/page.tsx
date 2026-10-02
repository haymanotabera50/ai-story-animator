'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { PromptSection } from '@/components/studio/PromptSection';
import { TimelineEditor } from '@/components/studio/TimelineEditor';
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
      visualPrompt: 'Establishing wide shot of a young Ethiopian boy shepherd wearing traditional white cotton Habesha tunic with colorful Tibeb borders, tending cute goats on lush green highland ridges of Kaffa, majestic misty Ethiopian mountains, golden hour sunlight, Pixar Disney 3D style',
      imageUrl: 'https://image.pollinations.ai/prompt/Establishing%20wide%20shot%20of%20a%20young%20Ethiopian%20boy%20shepherd%20wearing%20traditional%20white%20cotton%20Habesha%20tunic%20with%20colorful%20Tibeb%20borders%2C%20tending%20cute%20goats%20on%20lush%20green%20highland%20ridges%20of%20Kaffa%2C%20majestic%20misty%20Ethiopian%20mountains%2C%20golden%20hour%20sunlight%2C%20Pixar%20Disney%203D%20style?width=1024&height=576&seed=71042&nologo=true&model=flux',
      motionType: 'zoom-in',
      duration: 5,
      soundtrackMood: 'tizita',
    },
    {
      id: 'sc-2',
      order: 2,
      title: 'The Secret Red Berries (ቀያይ ፍሬዎች)',
      narration: 'Among the wild forest trees, he discovered mysterious bushes bearing bright crimson berries that sparkled like rubies in the morning light.',
      visualPrompt: 'Close up of a cute Ethiopian boy with expressive almond eyes gently holding branches of wild coffee trees with glowing vibrant red cherries, magical morning sunbeams illuminating the berries, Pixar 3D animated film render',
      imageUrl: 'https://image.pollinations.ai/prompt/Close%20up%20of%20a%20cute%20Ethiopian%20boy%20with%20expressive%20almond%20eyes%20gently%20holding%20branches%20of%20wild%20coffee%20trees%20with%20glowing%20vibrant%20red%20cherries%2C%20magical%20morning%20sunbeams%20illuminating%20the%20berries%2C%20Pixar%203D%20animated%20film%20render?width=1024&height=576&seed=84912&nologo=true&model=flux',
      motionType: 'pan-right',
      duration: 5,
      soundtrackMood: 'tizita',
    },
    {
      id: 'sc-3',
      order: 3,
      title: 'The Dance of Pure Joy (የፍስሐ ጭፈራ)',
      narration: 'After chewing the sweet cherries, the goats leaped and danced across the meadows with boundless joy, discovering the magical gift of Ethiopian coffee.',
      visualPrompt: 'Heartwarming playful scene of joyous goats dancing on their hind legs in a flowered Ethiopian mountain meadow with happy young Kaldi laughing, colorful wildflowers, soft sunset glow, Pixar 3D animation masterpiece',
      imageUrl: 'https://image.pollinations.ai/prompt/Heartwarming%20playful%20scene%20of%20joyous%20goats%20dancing%20on%20their%20hind%20legs%20in%20a%20flowered%20Ethiopian%20mountain%20meadow%20with%20happy%20young%20Kaldi%20laughing%2C%20colorful%20wildflowers%2C%20soft%20sunset%20glow%2C%20Pixar%203D%20animation%20masterpiece?width=1024&height=576&seed=96321&nologo=true&model=flux',
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
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
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
              {errorMsg}
            </div>
          )}
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

      {/* Cinema theater player */}
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
