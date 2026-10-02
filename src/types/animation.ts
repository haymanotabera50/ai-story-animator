export type ArtStyle = 
  | 'pixar-3d'
  | 'ghibli-anime'
  | 'watercolor'
  | 'comic-book'
  | 'claymation'
  | 'fantasy-art';

export type CameraMotion = 
  | 'zoom-in'
  | 'zoom-out'
  | 'pan-left'
  | 'pan-right'
  | 'pan-up'
  | 'drift';

export type AspectRatio = '16:9' | '9:16' | '1:1';

export type BgMusicMood = 'whimsical' | 'adventure' | 'bedtime' | 'cyberpunk' | 'none';

export interface StoryScene {
  id: string;
  order: number;
  title: string;
  narration: string;
  visualPrompt: string;
  imageUrl: string;
  motionType: CameraMotion;
  duration: number; // in seconds
  soundtrackMood?: BgMusicMood;
  subtitleTiming?: {
    words: string[];
    durations: number[];
  };
}

export interface StoryProject {
  id: string;
  title: string;
  prompt: string;
  style: ArtStyle;
  aspectRatio: AspectRatio;
  bgMusic: BgMusicMood;
  scenes: StoryScene[];
  createdAt: string;
}

export interface ArtStyleOption {
  id: ArtStyle;
  name: string;
  description: string;
  previewImage: string;
  promptSuffix: string;
}

