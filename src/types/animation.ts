export type ArtStyle = 
  | 'habesha-3d'
  | 'ethiopian-manuscript'
  | 'simien-folktale'
  | 'pixar-3d'
  | 'ghibli-anime'
  | 'watercolor'
  | 'comic-book';

export type CameraMotion = 
  | 'zoom-in'
  | 'zoom-out'
  | 'pan-left'
  | 'pan-right'
  | 'pan-up'
  | 'drift';

export type AspectRatio = '16:9' | '9:16' | '1:1';

export type BgMusicMood = 
  | 'tizita'
  | 'bati'
  | 'ambassel'
  | 'whimsical'
  | 'adventure'
  | 'bedtime'
  | 'none';

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
  amharicName: string;
  description: string;
  previewImage: string;
  promptSuffix: string;
}

