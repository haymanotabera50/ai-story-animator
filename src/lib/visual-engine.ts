import { ArtStyle, AspectRatio } from '@/types/animation';

// High-speed, curated cinematic illustrations with full CORS compatibility
const THEMATIC_VISUALS: Record<string, string[]> = {
  coffee: [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1024&q=80',
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1024&q=80',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1024&q=80',
  ],
  mountain: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1024&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1024&q=80',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1024&q=80',
  ],
  castle: [
    'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=1024&q=80',
    'https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=1024&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1024&q=80',
  ],
  manuscript: [
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1024&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1024&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1024&q=80',
  ],
  nature: [
    'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1024&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1024&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1024&q=80',
  ],
  stars: [
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1024&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1024&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1024&q=80',
  ],
  habesha: [
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1024&q=80',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1024&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1024&q=80',
  ],
  cartoon: [
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1024&q=80',
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1024&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1024&q=80',
  ],
};

export function getCuratedSceneImage(
  prompt: string,
  style: ArtStyle,
  orderIndex: number
): string {
  const lower = prompt.toLowerCase();
  let pool: string[] = THEMATIC_VISUALS.habesha;

  if (lower.includes('coffee') || lower.includes('kaldi') || lower.includes('berry') || lower.includes('goat')) {
    pool = THEMATIC_VISUALS.coffee;
  } else if (lower.includes('mountain') || lower.includes('simien') || lower.includes('highland') || lower.includes('ibex')) {
    pool = THEMATIC_VISUALS.mountain;
  } else if (lower.includes('castle') || lower.includes('gondar') || lower.includes('palace') || lower.includes('king')) {
    pool = THEMATIC_VISUALS.castle;
  } else if (lower.includes('manuscript') || lower.includes('parchment') || lower.includes('church') || lower.includes('biranna')) {
    pool = THEMATIC_VISUALS.manuscript;
  } else if (lower.includes('star') || lower.includes('sky') || lower.includes('night') || lower.includes('space')) {
    pool = THEMATIC_VISUALS.stars;
  } else if (style === 'pixar-3d' || style === 'comic-book') {
    pool = THEMATIC_VISUALS.cartoon;
  } else if (style === 'simien-folktale' || style === 'ghibli-anime') {
    pool = THEMATIC_VISUALS.nature;
  }

  const selected = pool[orderIndex % pool.length] || pool[0];
  return selected;
}

/**
 * Creates an instantaneous, beautiful SVG data-URI scene frame.
 * 100% reliable, loads in 0 milliseconds, zero CORS issues, 100% free!
 */
export function createProceduralSceneSvg(
  title: string,
  narration: string,
  style: ArtStyle,
  motionType: string
): string {
  const width = 1024;
  const height = 576;

  // Aesthetic color palettes based on style
  const gradients: Record<string, [string, string, string]> = {
    'habesha-3d': ['#f43f5e', '#a855f7', '#6366f1'], // Vibrant sunset rose to violet
    'ethiopian-manuscript': ['#d97706', '#92400e', '#451a03'], // Rich Biranna gold & dark umber
    'simien-folktale': ['#059669', '#0284c7', '#312e81'], // Lush highland emerald to twilight indigo
    'pixar-3d': ['#ec4899', '#8b5cf6', '#3b82f6'], // Cheerful candy gradient
    'ghibli-anime': ['#10b981', '#06b6d4', '#1e1b4b'], // Nostalgic anime twilight
    'watercolor': ['#f472b6', '#c084fc', '#e0e7ff'], // Soft pastel watercolor
    'comic-book': ['#ef4444', '#f59e0b', '#7c3aed'], // Dynamic bold pop
  };

  const [col1, col2, col3] = gradients[style] || gradients['habesha-3d'];
  const safeTitle = escapeXml(title.slice(0, 35));
  const safeSubtitle = escapeXml(narration.slice(0, 60) + '...');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${col1}" />
      <stop offset="50%" stop-color="${col2}" />
      <stop offset="100%" stop-color="${col3}" />
    </linearGradient>
    <radialGradient id="sun" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#fff" stop-opacity="0" />
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <rect width="${width}" height="${height}" fill="url(#sun)" />

  <!-- Mountain Silhouettes -->
  <path d="M0 450 Q 200 320, 450 420 T 900 360 L 1024 400 L 1024 576 L 0 576 Z" fill="#000" fill-opacity="0.35" />
  <path d="M0 500 Q 300 390, 600 480 T 1024 460 L 1024 576 L 0 576 Z" fill="#000" fill-opacity="0.45" />

  <!-- Ethiopian Lalibela Cross Embellishment in Center -->
  <g transform="translate(480, 160)" fill="#ffffff" fill-opacity="0.25">
    <path d="M30 4h4v6h-4z" />
    <circle cx="32" cy="3" r="2" />
    <path d="M29 10h6v12h12v6h-12v18h-6V28H17v-6h12V10z" />
    <path d="M26 12h12v4H26z" />
    <path d="M12 25h6v12h-6z" />
    <path d="M46 25h6v12h-6z" />
    <circle cx="32" cy="25" r="2" fill="#000" />
  </g>

  <!-- Title & Chapter Overlay -->
  <text x="512" y="290" text-anchor="middle" font-family="system-ui, sans-serif" font-size="34" font-weight="900" fill="#ffffff" filter="url(#glow)">${safeTitle}</text>
  <text x="512" y="340" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="500" fill="#fce7f3" fill-opacity="0.9">${safeSubtitle}</text>
</svg>
`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
