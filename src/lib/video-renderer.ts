import { StoryScene, CameraMotion } from '@/types/animation';
import { preloadImage } from './image-generator';

export interface RenderProgress {
  currentScene: number;
  totalScenes: number;
  progressPercent: number;
  statusText: string;
}

export async function renderStoryToVideo(
  scenes: StoryScene[],
  onProgress?: (progress: RenderProgress) => void
): Promise<Blob> {
  const width = 1280;
  const height = 720;
  const fps = 30;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  onProgress?.({
    currentScene: 0,
    totalScenes: scenes.length,
    progressPercent: 5,
    statusText: 'Loading illustrations...',
  });

  // Preload all images guaranteed with fast fallback
  const loadedImages: HTMLImageElement[] = [];
  for (let i = 0; i < scenes.length; i++) {
    try {
      const img = await preloadImage(scenes[i].imageUrl, scenes[i].title);
      loadedImages.push(img);
    } catch {
      // Emergency canvas fallback
      const fallback = document.createElement('canvas');
      fallback.width = width;
      fallback.height = height;
      const fCtx = fallback.getContext('2d')!;
      fCtx.fillStyle = '#4c1d95';
      fCtx.fillRect(0, 0, width, height);
      fCtx.fillStyle = '#ffffff';
      fCtx.font = 'bold 36px sans-serif';
      fCtx.fillText(scenes[i].title, 100, height / 2);
      const img = new Image();
      img.src = fallback.toDataURL();
      loadedImages.push(img);
    }
  }

  // Setup MediaRecorder
  const stream = canvas.captureStream(fps);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : MediaRecorder.isTypeSupported('video/webm')
    ? 'video/webm'
    : 'video/mp4';

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 3500000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>((resolve) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };
  });

  mediaRecorder.start();

  const totalScenes = scenes.length;
  // Use compact render duration for fast video export (3.5s per scene during recording)
  const sceneRenderSec = 3.5;
  const totalFramesPerScene = Math.floor(sceneRenderSec * fps);

  for (let sIdx = 0; sIdx < totalScenes; sIdx++) {
    const scene = scenes[sIdx];
    const img = loadedImages[sIdx];
    const motion = scene.motionType;

    for (let frame = 0; frame < totalFramesPerScene; frame++) {
      const t = frame / totalFramesPerScene;

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Camera motion
      ctx.save();
      applyCameraTransform(ctx, width, height, motion, t);
      drawImageCover(ctx, img, width, height);
      ctx.restore();

      // Vignette
      drawVignette(ctx, width, height);

      // Subtitles
      drawSubtitles(ctx, width, height, scene.narration, t);

      // Progress bar
      ctx.fillStyle = 'rgba(244, 114, 182, 0.7)'; // Light pink bar
      const barW = (width / totalScenes) * (sIdx + t);
      ctx.fillRect(0, height - 6, barW, 6);

      // Frame interval
      await new Promise((r) => setTimeout(r, 1000 / fps));

      if (frame % 8 === 0) {
        const overallPercent = 10 + Math.floor(((sIdx + t) / totalScenes) * 88);
        onProgress?.({
          currentScene: sIdx + 1,
          totalScenes,
          progressPercent: overallPercent,
          statusText: `Rendering scene ${sIdx + 1} of ${totalScenes}...`,
        });
      }
    }
  }

  mediaRecorder.stop();

  onProgress?.({
    currentScene: totalScenes,
    totalScenes,
    progressPercent: 100,
    statusText: 'Encoding finished! Video ready for download.',
  });

  return await recordingPromise;
}

function applyCameraTransform(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  motion: CameraMotion,
  t: number
) {
  const cx = w / 2;
  const cy = h / 2;
  ctx.translate(cx, cy);

  let scale = 1.0;
  let dx = 0;
  let dy = 0;

  switch (motion) {
    case 'zoom-in':
      scale = 1.0 + t * 0.22;
      break;
    case 'zoom-out':
      scale = 1.22 - t * 0.22;
      break;
    case 'pan-left':
      scale = 1.15;
      dx = (1 - t * 2) * (w * 0.06);
      break;
    case 'pan-right':
      scale = 1.15;
      dx = (t * 2 - 1) * (w * 0.06);
      break;
    case 'pan-up':
      scale = 1.15;
      dy = (1 - t * 2) * (h * 0.06);
      break;
    case 'drift':
    default:
      scale = 1.08 + Math.sin(t * Math.PI) * 0.06;
      dx = Math.sin(t * Math.PI * 2) * 15;
      dy = Math.cos(t * Math.PI * 2) * 10;
      break;
  }

  ctx.scale(scale, scale);
  ctx.translate(-cx + dx, -cy + dy);
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const imgRatio = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
  const canvasRatio = w / h;

  let dw = w;
  let dh = h;
  let dx = 0;
  let dy = 0;

  if (imgRatio > canvasRatio) {
    dw = h * imgRatio;
    dx = (w - dw) / 2;
  } else {
    dh = w / imgRatio;
    dy = (h - dh) / 2;
  }

  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const gradient = ctx.createRadialGradient(w / 2, h / 2, h * 0.45, w / 2, h / 2, w * 0.75);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.65)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function drawSubtitles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  text: string,
  _progress: number
) {
  if (!text) return;

  ctx.save();
  ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const maxWidth = w * 0.8;
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const testLine = `${currentLine} ${words[i]}`;
    if (ctx.measureText(testLine).width < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);

  const lineHeight = 36;
  const boxHeight = lines.length * lineHeight + 24;
  const boxWidth = Math.min(maxWidth + 48, w * 0.85);
  const boxX = (w - boxWidth) / 2;
  const boxY = h - boxHeight - 32;

  // Background pill
  ctx.fillStyle = 'rgba(24, 10, 40, 0.82)';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 16);
  ctx.fill();

  ctx.strokeStyle = 'rgba(244, 114, 182, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Subtitle text
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 6;

  lines.forEach((line, idx) => {
    const textY = boxY + 20 + idx * lineHeight + lineHeight / 2;
    ctx.fillText(line, w / 2, textY);
  });

  ctx.restore();
}
