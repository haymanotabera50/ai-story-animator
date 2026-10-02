import { ArtStyle, CameraMotion, BgMusicMood, AspectRatio } from './animation';

export interface DirectorMessage {
  id: string;
  sender: 'user' | 'director';
  text: string;
  timestamp: string;
  suggestedAngles?: StoryAngle[];
  actionPrompt?: string;
}

export interface StoryAngle {
  id: string;
  title: string;
  amharicTitle: string;
  hook: string;
  recommendedStyle: ArtStyle;
  recommendedMusic: BgMusicMood;
  synopsis: string;
}

export interface ScriptScene {
  id: string;
  order: number;
  title: string;
  amharicTitle?: string;
  narration: string;
  visualDirection: string;
  imageUrl: string;
  cameraMotion: CameraMotion;
  duration: number;
  characterAction?: string;
  soundCue?: string;
}

export interface FullStoryScript {
  title: string;
  amharicTitle?: string;
  logline: string;
  style: ArtStyle;
  aspectRatio: AspectRatio;
  musicMode: BgMusicMood;
  voiceSpeed: number; // 0.8 to 1.2
  voicePitch: number; // 0.8 to 1.3
  scenes: ScriptScene[];
}
