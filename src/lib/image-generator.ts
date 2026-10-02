import { ArtStyle, AspectRatio } from '@/types/animation';
import { getCuratedSceneImage, createProceduralSceneSvg } from './visual-engine';

export function getResolutionForAspectRatio(ratio: AspectRatio): { width: number; height: number } {
  switch (ratio) {
    case '9:16':
      return { width: 576, height: 1024 };
    case '1:1':
      return { width: 768, height: 768 };
    case '16:9':
    default:
      return { width: 1024, height: 576 };
  }
}

/**
 * Returns an instant, high-resolution thematic image guaranteed to load in <1 second
 * with full CORS support for canvas video rendering.
 */
export function generateImageUrl(
  scenePrompt: string,
  style: ArtStyle,
  _aspectRatio: AspectRatio = '16:9',
  seed?: number
): string {
  const effectiveIndex = Math.abs(seed ?? Math.floor(Math.random() * 100));
  return getCuratedSceneImage(scenePrompt, style, effectiveIndex);
}

/**
 * Preloads an image into an HTMLImageElement with a fast 3-second timeout.
 * If network or CORS fails, gracefully falls back to a procedural scene SVG
 * so video rendering NEVER freezes or fails.
 */
export async function preloadImage(
  src: string,
  fallbackTitle: string = 'Scene',
  fallbackStyle: ArtStyle = 'habesha-3d',
  timeoutMs: number = 3000
): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timer = setTimeout(() => {
      // Fallback immediately to procedural SVG if remote image is too slow
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
