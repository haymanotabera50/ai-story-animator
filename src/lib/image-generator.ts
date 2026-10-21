import { ArtStyle, AspectRatio } from '@/types/animation';
import { createProceduralSceneSvg } from './visual-engine';

export function getResolutionForAspectRatio(ratio: AspectRatio): { width: number; height: number } {
  switch (ratio) {
    case '9:16':
      return { width: 450, height: 800 };
    case '1:1':
      return { width: 600, height: 600 };
    case '16:9':
    default:
      return { width: 800, height: 450 };
  }
}

const STYLE_PROMPT_MODIFIERS: Record<ArtStyle, string> = {
  'habesha-3d':
    'Pixar Disney 3D animation style, Ethiopian Habesha character in traditional white cotton clothes with ornate Tibeb embroidery, lush green highlands background, expressive warm eyes, volumetric cinematic lighting, 8k render, masterpiece',
  'ethiopian-manuscript':
    'Ancient Ethiopian illuminated Biranna manuscript style, gold leaf foil textures, deep mineral ochres, sacred Abyssinian folk art, parchment textures',
  'simien-folktale':
    'Majestic storybook folklore illustration, dramatic Simien mountain cliffs, golden sunlight, misty highland peaks, rich vibrant colors, enchanting atmosphere',
  'pixar-3d':
    'Pixar 3D animated CGI cartoon movie still, ultra detailed, cute expressive characters, vibrant colors, raytracing, cinematic composition',
  'ghibli-anime':
    'Studio Ghibli anime style, painted gouache backgrounds, hand-drawn anime aesthetic, Hayao Miyazaki aesthetic, beautiful lush nature scenery, emotional wonder',
  'watercolor':
    'Delicate pastel watercolor storybook painting, soft color bleeding, textured paper, artistic dreamy children book illustration',
  'comic-book':
    'Vibrant comic book panel, cel-shaded animation, bold clean dynamic lines, pop art color grading, cinematic hero framing',
};

/**
 * Generates a real, custom AI image tailored directly to the user's prompt using Pollinations AI (Sana).
 * Fast resolution (800x450) optimized for smooth, reliable web playback.
 */
export function generateImageUrl(
  scenePrompt: string,
  style: ArtStyle,
  aspectRatio: AspectRatio = '16:9',
  seed?: number
): string {
  const { width, height } = getResolutionForAspectRatio(aspectRatio);
  const effectiveSeed = Math.abs(seed ?? Math.floor(Math.random() * 899999 + 100000));
  const styleModifier = STYLE_PROMPT_MODIFIERS[style] || STYLE_PROMPT_MODIFIERS['habesha-3d'];

  // Clean prompt and combine with style modifiers
  const cleanPrompt = scenePrompt
    .replace(/[^\w\s,.-]/gi, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 160);

  const fullVisualPrompt = `${cleanPrompt}, ${styleModifier}`;
  const encoded = encodeURIComponent(fullVisualPrompt);

  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${effectiveSeed}&nologo=true`;
}

/**
 * Preloads an image into an HTMLImageElement with a 8-second timeout.
 * If network or CORS fails, gracefully falls back to a procedural scene SVG
 * so video rendering NEVER freezes or fails.
 */
export async function preloadImage(
  src: string,
  fallbackTitle: string = 'Scene',
  fallbackStyle: ArtStyle = 'habesha-3d',
  timeoutMs: number = 8000
): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timer = setTimeout(() => {
      const fallbackSvg = createProceduralSceneSvg(fallbackTitle, '', fallbackStyle, 'zoom-in');
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.src = fallbackSvg;
    }, timeoutMs);

    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };

    img.onerror = () => {
      clearTimeout(timer);
      const fallbackSvg = createProceduralSceneSvg(fallbackTitle, '', fallbackStyle, 'zoom-in');
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.src = fallbackSvg;
    };

    img.src = src;
  });
}
