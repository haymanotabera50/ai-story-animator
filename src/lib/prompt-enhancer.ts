import { ArtStyle } from '@/types/animation';

/**
 * Leonardo.ai-style Magic Prompt Enhancer
 * Takes a simple user prompt and expands it with rich cinematic camera directions,
 * atmospheric lighting, texture details, and movement cues.
 */
export function enhancePromptWithAI(rawPrompt: string, style: ArtStyle): string {
  const clean = rawPrompt.trim();
  if (!clean) return clean;

  const styleEnhancements: Record<ArtStyle, string> = {
    'habesha-3d': 'vibrant 3D animated film scene, authentic Habesha characters with hand-woven colorful Tibeb embroidery, golden hour volumetric sunbeams, warm emotional expressions, highly detailed cinematic rendering',
    'ethiopian-manuscript': 'illuminated ancient Ethiopian Biranna parchment painting, rich mineral pigments of ochre and indigo, expressive sacred almond eyes, ancient gold leaf accents, authentic Abyssinian fresco masterpiece',
    'simien-folktale': 'Studio Ghibli aesthetic highland animation, misty Simien mountain cliffs, lush green valleys, acacia trees swaying in the breeze, whimsical floating atmospheric light particles, breathtaking fantasy landscape',
    'pixar-3d': 'Disney Pixar 3D animation style, volumetric soft lighting, subsurface scattering, expressive joyful characters, rich color saturation, 8k cinematic render',
    'ghibli-anime': 'hand-drawn classic anime movie aesthetic, Hayao Miyazaki inspired, soft nostalgic twilight sky, lush hand-painted scenery, warm and emotional atmosphere',
    'watercolor': 'delicate storybook watercolor illustration, gentle ink washes, textured cotton paper, soft pastel colors, whimsical children book masterpiece',
    'comic-book': 'dynamic graphic novel panel, bold black ink outlines, halftone dot textures, dramatic cinematic lighting, vibrant saturated action illustration',
  };

  const suffix = styleEnhancements[style] || 'cinematic lighting, rich colors, smooth motion';
  
  // Combine into enhanced prompt
  return `${clean}, cinematic establishing composition, ${suffix}, smooth camera motion, masterpiece quality`;
}
