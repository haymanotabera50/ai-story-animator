'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { PromptSection } from '@/components/studio/PromptSection';
import { TimelineEditor } from '@/components/studio/TimelineEditor';
import { CinemaPlayerModal } from '@/components/player/CinemaPlayerModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { StoryProject, StoryScene, ArtStyle, BgMusicMood } from '@/types/animation';
import { generateImageUrl } from '@/lib/image-generator';

const INITIAL_PROJECT: StoryProject = {
  id: 'starter-project',
  title: 'The Clockwork Baker',
  prompt: 'A friendly vintage brass robot opens a bakery in Paris and invents croissants that give people happy dreams.',
  style: 'pixar-3d',
  aspectRatio: '16:9',
  bgMusic: 'whimsical',
  createdAt: new Date().toISOString(),
  scenes: [
    {
      id: 'sc-1',
      order: 1,
      title: 'Dawn at the Boulangerie',
      narration: 'Deep in the cobblestone alleys of Paris, a little brass robot named Barnaby wound his gears each morning before dawn.',
      visualPrompt: 'Establishing wide shot of a charming vintage Paris bakery storefront at early dawn, warm glowing lantern light through windows, cobblestone street, Pixar Disney 3D style',
      imageUrl: 'https://image.pollinations.ai/prompt/Establishing%20wide%20shot%20of%20a%20charming%20vintage%20Paris%20bakery%20storefront%20at%20early%20dawn%20with%20a%20cute%20brass%20robot%20baker%2C%20warm%20golden%20glowing%20lanterns%2C%20Pixar%20Disney%203D%20animation%20style%2C%20highly%20detailed%208k?width=1024&height=576&seed=14201&nologo=true&model=flux',
      motionType: 'zoom-in',
      duration: 5,
    },
    {
      id: 'sc-2',
      order: 2,
      title: 'The Starlight Flour',
      narration: 'With gentle ticking precision, Barnaby dusted sweet cinnamon and moonlight sugar into freshly kneaded golden dough.',
      visualPrompt: 'Close up of a cute friendly brass robot wearing a tiny chef hat kneading glowing magical golden pastry dough, glowing flour sparks floating in the air, warm cozy kitchen, Pixar 3D style',
      imageUrl: 'https://image.pollinations.ai/prompt/Close%20up%20of%20a%20cute%20brass%20robot%20wearing%20a%20white%20chef%20hat%20kneading%20glowing%20golden%20pastry%20dough%2C%20magical%20sparkles%20in%20warm%20sunlit%20kitchen%2C%20Pixar%20Disney%203D%20style?width=1024&height=576&seed=28512&nologo=true&model=flux',
      motionType: 'pan-right',
      duration: 5,
    },
    {
      id: 'sc-3',
      order: 3,
      title: 'Flavors of Pure Joy',
      narration: 'Whoever tasted his dream croissants suddenly felt the weight of the world melt away into laughter and quiet peace.',
      visualPrompt: 'Happy smiling Parisian people outside a cute bakery enjoying delicious golden croissants, heartwarming expression of wonder, soft afternoon sunshine, Pixar 3D animation masterpiece',
      imageUrl: 'https://image.pollinations.ai/prompt/Heartwarming%20scene%20of%20delighted%20people%20tasting%20golden%20fresh%20croissants%20outside%20a%20magical%20Parisian%20bakery%2C%20smiling%20robot%20waving%20from%20doorway%2C%20Pixar%203D%20style?width=1024&height=576&seed=49120&nologo=true&model=flux',
      motionType: 'zoom-out',
      duration: 6,
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
    sceneCount: number
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
        aspectRatio: '16:9',
        bgMusic: data.story.bgMusic || 'whimsical',
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
        title: `Scene ${nextOrder}: New Horizon`,
        narration: 'And as twilight settled, the story took an unexpected and wonderful turn...',
        visualPrompt: `Cinematic wide view, chapter ${nextOrder} of ${prev.prompt}`,
        imageUrl: generateImageUrl(
          `Cinematic wide view, chapter ${nextOrder} of ${prev.prompt}`,
          prev.style,
          '16:9',
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
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
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
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

