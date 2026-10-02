import { ArtStyleOption, CameraMotion, BgMusicMood } from '@/types/animation';

export const ART_STYLES: ArtStyleOption[] = [
  {
    id: 'pixar-3d',
    name: '3D Pixar Animation',
    description: 'Vibrant, rich volumetric lighting, cute expressive characters, Disney/Pixar movie feel',
    previewImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    promptSuffix: 'Pixar Disney 3D animation movie style, vibrant colors, volumetric lighting, subsurface scattering, expressive characters, cute, cinematic 3D render, highly detailed, 8k',
  },
  {
    id: 'ghibli-anime',
    name: 'Studio Ghibli Anime',
    description: 'Hand-drawn anime aesthetic, lush painted backgrounds, nostalgic and whimsical vibe',
    previewImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    promptSuffix: 'Studio Ghibli anime style, Hayao Miyazaki inspired, hand painted background, watercolor textures, soft sunbeams, whimsical dreamy atmosphere, high aesthetic masterpiece',
  },
  {
    id: 'watercolor',
    name: 'Watercolor Storybook',
    description: 'Classic children’s storybook illustration with soft pastel washes and gentle lineart',
    previewImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80',
    promptSuffix: 'storybook watercolor painting, ink and wash, gentle soft textures, Beatrix Potter style, nostalgic children picture book illustration, pastel colors, cozy aesthetic',
  },
  {
    id: 'comic-book',
    name: 'Dynamic Comic / Pop',
    description: 'Bold black inking, halftone dot patterns, vibrant saturated colors, graphic novel style',
    previewImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80',
    promptSuffix: 'modern comic book art, bold dynamic ink lineart, vibrant saturated colors, halftone textures, dramatic lighting, graphic novel illustration, stylish',
  },
  {
    id: 'claymation',
    name: 'Cozy Claymation',
    description: 'Charming plasticine stop-motion feel with handmade textures and miniature lighting',
    previewImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80',
    promptSuffix: 'claymation stop-motion style, Aardman animations aesthetic, handmade plasticine texture, cute miniature diorama, studio lighting, depth of field',
  },
  {
    id: 'fantasy-art',
    name: 'Enchanted Fantasy',
    description: 'Magical, glowing particles, deep mystical forests, starry skies and epic wonders',
    previewImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    promptSuffix: 'enchanted fantasy digital painting, magical glowing particles, ethereal atmosphere, mystical colors, bioluminescent, breathtaking cinematic concept art',
  },
];

export const CAMERA_MOTIONS: { id: CameraMotion; label: string; iconName: string; description: string }[] = [
  { id: 'zoom-in', label: 'Zoom In', iconName: 'ZoomIn', description: 'Smoothly closes in on the focal subject' },
  { id: 'zoom-out', label: 'Zoom Out', iconName: 'ZoomOut', description: 'Reveals the broader landscape' },
  { id: 'pan-left', label: 'Pan Left', iconName: 'ArrowLeft', description: 'Glides horizontally to the left' },
  { id: 'pan-right', label: 'Pan Right', iconName: 'ArrowRight', description: 'Glides horizontally to the right' },
  { id: 'pan-up', label: 'Tilt Up', iconName: 'ArrowUp', description: 'Rises from ground to sky' },
  { id: 'drift', label: 'Floating Drift', iconName: 'Compass', description: 'Gentle organic camera sway' },
];

export const SAMPLE_PROMPTS = [
  {
    title: 'The Brave Little Star',
    prompt: 'A tiny fallen star in a magical forest makes friends with a curious baby owl who helps it find a way back to the night sky.',
    style: 'ghibli-anime' as const,
  },
  {
    title: 'The Clockwork Baker',
    prompt: 'A friendly vintage brass robot opens a bakery in Paris and invents croissants that give people happy dreams.',
    style: 'pixar-3d' as const,
  },
  {
    title: 'Ocean of Clouds',
    prompt: 'A daring penguin with aviator goggles builds a hot air balloon to explore what lies above the storm clouds.',
    style: 'watercolor' as const,
  },
  {
    title: 'The Neon Cat Detective',
    prompt: 'A sleek cat detective in a rainy cyberpunk metropolis searches for a missing holographic fish.',
    style: 'comic-book' as const,
  },
];

