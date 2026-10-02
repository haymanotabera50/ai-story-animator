import { StoryScene, ArtStyle, CameraMotion, BgMusicMood } from '@/types/animation';
import { generateImageUrl } from './image-generator';

const CAMERA_SEQUENCE: CameraMotion[] = ['zoom-in', 'pan-right', 'zoom-out', 'pan-left', 'pan-up', 'drift'];

interface GenerateStoryInput {
  prompt: string;
  style: ArtStyle;
  sceneCount?: number;
  apiKey?: string;
}

export async function generateStoryScenes({
  prompt,
  style,
  sceneCount = 4,
  apiKey,
}: GenerateStoryInput): Promise<{ title: string; scenes: StoryScene[]; bgMusic: BgMusicMood }> {
  // Try Google Gemini API if key is available
  const activeGeminiKey = apiKey || process.env.GEMINI_API_KEY;
  if (activeGeminiKey) {
    try {
      return await generateWithGemini(prompt, style, sceneCount, activeGeminiKey);
    } catch (err) {
      console.warn('Gemini generation failed, falling back to autonomous story director:', err);
    }
  }

  // Fallback to built-in Creative Director Story Engine
  return generateWithCreativeDirector(prompt, style, sceneCount);
}

async function generateWithGemini(
  userPrompt: string,
  style: ArtStyle,
  sceneCount: number,
  apiKey: string
): Promise<{ title: string; scenes: StoryScene[]; bgMusic: BgMusicMood }> {
  const systemInstruction = `You are an elite animated short film director and story artist.
Break down the user's story idea into exactly ${sceneCount} sequential animated scenes.
Format your output strictly as a JSON object matching this schema:
{
  "title": "Short catchy title",
  "bgMusic": "whimsical" | "adventure" | "bedtime" | "cyberpunk",
  "scenes": [
    {
      "title": "Scene title",
      "narration": "Poetic, expressive voiceover narration (2-3 sentences)",
      "visualPrompt": "Detailed visual description of characters, environment, lighting, and action for image generation. Keep character details consistent across scenes.",
      "motionType": "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | "pan-up" | "drift",
      "duration": 5
    }
  ]
}
Return only valid JSON, without any markdown formatting or commentary.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nStory idea: "${userPrompt}"\nTarget Art Style: "${style}"` }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini');

  const parsed = JSON.parse(rawText);
  const scenes: StoryScene[] = (parsed.scenes || []).map((sc: any, idx: number) => ({
    id: `scene-${Date.now()}-${idx}`,
    order: idx + 1,
    title: sc.title || `Scene ${idx + 1}`,
    narration: sc.narration || '',
    visualPrompt: sc.visualPrompt || userPrompt,
    imageUrl: generateImageUrl(sc.visualPrompt || userPrompt, style, '16:9', 1000 + idx * 77),
    motionType: (sc.motionType as CameraMotion) || CAMERA_SEQUENCE[idx % CAMERA_SEQUENCE.length],
    duration: Math.max(4, Math.min(8, sc.duration || 5)),
  }));

  return {
    title: parsed.title || 'Untitled Animated Tale',
    bgMusic: (parsed.bgMusic as BgMusicMood) || 'whimsical',
    scenes,
  };
}

/**
 * Autonomous Creative Director: Intelligently generates vivid storyboards
 * with cohesive character consistency, emotional narrative arcs, and visual prompts.
 */
function generateWithCreativeDirector(
  userPrompt: string,
  style: ArtStyle,
  sceneCount: number
): { title: string; scenes: StoryScene[]; bgMusic: BgMusicMood } {
  const cleanedPrompt = userPrompt.trim();
  const title = deriveTitleFromPrompt(cleanedPrompt);

  // Determine mood based on keywords
  let bgMusic: BgMusicMood = 'whimsical';
  const lower = cleanedPrompt.toLowerCase();
  if (lower.includes('cyber') || lower.includes('space') || lower.includes('neon') || lower.includes('robot')) {
    bgMusic = 'cyberpunk';
  } else if (lower.includes('adventure') || lower.includes('quest') || lower.includes('dragon') || lower.includes('ocean')) {
    bgMusic = 'adventure';
  } else if (lower.includes('sleep') || lower.includes('night') || lower.includes('bed') || lower.includes('dream')) {
    bgMusic = 'bedtime';
  }

  const baseSeed = Math.floor(Math.random() * 800000);

  const sceneTemplates = [
    {
      stage: 'The Beginning',
      narrationPattern: (p: string) =>
        `Once upon a quiet horizon, ${p.toLowerCase().replace(/^(a|an|the)\s+/i, '')}. Everything seemed ordinary until an unexpected flicker of wonder changed the day.`,
      visualPrefix: 'Establishing wide shot, introducing the setting and character, tranquil atmosphere, cinematic lighting',
      motion: 'zoom-in' as CameraMotion,
      duration: 5,
    },
    {
      stage: 'The Discovery',
      narrationPattern: () =>
        `Drawn by curiosity, a hidden secret revealed itself beneath glowing lights. The world began to whisper promises of an unforgettable journey.`,
      visualPrefix: 'Medium close-up shot, character discovering something magical, glowing light illuminating their eyes with wonder',
      motion: 'pan-right' as CameraMotion,
      duration: 5,
    },
    {
      stage: 'The Great Leap',
      narrationPattern: () =>
        `With courage stirring deep within, every fear dissolved into sheer determination. It was time to take flight toward the unknown.`,
      visualPrefix: 'Dynamic action angle, soaring movement, vibrant swirling elements, dramatic sense of motion and excitement',
      motion: 'pan-up' as CameraMotion,
      duration: 6,
    },
    {
      stage: 'Heartwarming Reunion',
      narrationPattern: () =>
        `And as the sun painted the sky in shades of gold, they knew that true magic was never the destination, but the courage to dream along the way.`,
      visualPrefix: 'Golden hour cinematic master shot, heartwarming embrace, sunset glow, floating particles of light, peaceful ending',
      motion: 'zoom-out' as CameraMotion,
      duration: 6,
    },
    {
      stage: 'The Legacy',
      narrationPattern: () =>
        `From that day forth, stars shone just a little brighter, carrying whispers of their brave adventure across the endless skies.`,
      visualPrefix: 'Starlit sky overview, character looking out into the serene horizon, twinkling constellations, peaceful twilight',
      motion: 'drift' as CameraMotion,
      duration: 5,
    },
  ];

  const actualCount = Math.min(Math.max(sceneCount, 3), 5);
  const selectedTemplates = sceneTemplates.slice(0, actualCount);

  const scenes: StoryScene[] = selectedTemplates.map((tpl, idx) => {
    const scenePrompt = `${tpl.visualPrefix}, featuring ${cleanedPrompt}`;
    const imageUrl = generateImageUrl(scenePrompt, style, '16:9', baseSeed + idx * 133);

    return {
      id: `scene-${Date.now()}-${idx}`,
      order: idx + 1,
      title: `${tpl.stage}`,
      narration: tpl.narrationPattern(cleanedPrompt),
      visualPrompt: scenePrompt,
      imageUrl,
      motionType: tpl.motion,
      duration: tpl.duration,
      soundtrackMood: bgMusic,
    };
  });

  return {
    title,
    bgMusic,
    scenes,
  };
}

function deriveTitleFromPrompt(prompt: string): string {
  const words = prompt.replace(/[^\w\s]/gi, '').split(/\s+/).slice(0, 5);
  if (words.length === 0) return 'The Magic Adventure';
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

