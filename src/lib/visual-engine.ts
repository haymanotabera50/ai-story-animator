import { ArtStyle } from '@/types/animation';

/**
 * Creates an instantaneous, beautiful SVG data-URI scene frame.
 * 100% reliable, loads in 0 milliseconds, zero CORS issues, 100% free!
 */
export function createProceduralSceneSvg(
  title: string,
  narration: string,
  style: ArtStyle,
  _motionType: string
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
  const safeTitle = escapeXml(title.slice(0, 45));
  const safeNarration = escapeXml(narration.slice(0, 90));

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${col1}" />
        <stop offset="50%" stop-color="${col2}" />
        <stop offset="100%" stop-color="${col3}" />
      </linearGradient>
      <radialGradient id="sunGlow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#fef08a" stop-opacity="0.8" />
        <stop offset="50%" stop-color="#fbbf24" stop-opacity="0.3" />
        <stop offset="100%" stop-color="${col2}" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="tibebPattern" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#f43f5e" />
        <stop offset="33%" stop-color="#fbbf24" />
        <stop offset="66%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#8b5cf6" />
      </linearGradient>
    </defs>

    <!-- Sky Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Radiant Sun / Aura -->
    <circle cx="512" cy="240" r="220" fill="url(#sunGlow)" />

    <!-- Distant Mountains Layer 1 -->
    <path d="M0 430 Q 180 300, 360 410 T 720 370 T 1024 430 L 1024 576 L 0 576 Z" fill="rgba(15, 23, 42, 0.45)" />

    <!-- Foreground Mountain Peaks Layer 2 -->
    <path d="M0 480 Q 240 370, 512 470 T 1024 460 L 1024 576 L 0 576 Z" fill="rgba(15, 23, 42, 0.75)" />

    <!-- Glowing Stars / Floating Coffee Embers -->
    <circle cx="160" cy="120" r="3" fill="#fef08a" opacity="0.9" />
    <circle cx="280" cy="80" r="2" fill="#ffffff" opacity="0.8" />
    <circle cx="440" cy="140" r="4" fill="#fbbf24" opacity="0.85" />
    <circle cx="700" cy="90" r="3.5" fill="#f43f5e" opacity="0.9" />
    <circle cx="860" cy="130" r="2.5" fill="#fef08a" opacity="0.75" />
    <circle cx="920" cy="70" r="3" fill="#ffffff" opacity="0.9" />

    <!-- Central Lalibela Cross Emblem -->
    <g transform="translate(512, 220) scale(0.95)" opacity="0.85">
      <path d="M-6 -50 H6 V-20 H20 V-6 H50 V6 H20 V20 H6 V50 H-6 V20 H-20 V6 H-50 V-6 H-20 V-20 H-6 Z" fill="#fef08a" />
      <circle cx="0" cy="0" r="12" fill="none" stroke="#fbbf24" stroke-width="3" />
    </g>

    <!-- Ethiopian Tibeb Border Accent at Bottom -->
    <rect x="0" y="${height - 14}" width="${width}" height="14" fill="url(#tibebPattern)" />

    <!-- Center Card Overlay -->
    <rect x="180" y="320" width="664" height="150" rx="20" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(244, 114, 182, 0.4)" stroke-width="2" />

    <!-- Title -->
    <text x="512" y="375" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" text-anchor="middle">
      ${safeTitle}
    </text>

    <!-- Narration excerpt -->
    <text x="512" y="420" fill="#fbcfe8" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="16" text-anchor="middle">
      ${safeNarration}
    </text>

    <!-- Subtitle Branding -->
    <text x="512" y="450" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="12" text-anchor="middle" letter-spacing="2">
      AHADU ANIMATION STUDIO • አሐዱ
    </text>
  </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
