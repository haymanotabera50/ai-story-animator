import { ArtStyle, AspectRatio } from '@/types/animation';
import { ART_STYLES } from './constants';

export function getResolutionForAspectRatio(ratio: AspectRatio): { width: number; height: number } {
  switch (ratio) {
    case '16:9':
      return { width: 1024, height: 576 };
    case '9:16':
      return { width: 576, height: 1024 };
    case '1:1':
    default:
      return { width: 768, height: 768 };
  }
}

export function buildFullImagePrompt(scenePrompt: string, style: ArtStyle): string {
  const styleConfig = ART_STYLES.find((s) => s.id === style);
  const suffix = styleConfig ? styleConfig.promptSuffix : 'high quality animation illustration, detailed, vibrant';
  return `${scenePrompt}, ${suffix}`;
}

export function generateImageUrl(
  scenePrompt: string,
  style: ArtStyle,
  aspectRatio: AspectRatio = '16:9',
  seed?: number
): string {
  const fullPrompt = buildFullImagePrompt(scenePrompt, style);
  const { width, height } = getResolutionForAspectRatio(aspectRatio);
  const effectiveSeed = seed ?? Math.floor(Math.random() * 999999);
  
  // Truncate to prevent excessively long URLs
  const cleanPrompt = fullPrompt.slice(0, 280);
  const encoded = encodeURIComponent(cleanPrompt);
  
  // Fast, reliable image generation via Pollinations
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${effectiveSeed}&nologo=true`;
}

/**
 * Preloads an image into an HTMLImageElement with a timeout to prevent hanging.
 */
export async function preloadImage(src: string, timeoutMs: number = 8000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timer = setTimeout(() => {
      reject(new Error('Image preload timeout'));
    }, timeoutMs);

    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };

    img.onerror = (err) => {
      clearTimeout(timer);
      reject(err);
    };

    img.src = src;
  });
}
