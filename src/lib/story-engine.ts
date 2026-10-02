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

  // Built-in Creative Director
  return generateWithCreativeDirector(prompt, style, sceneCount);
}

async function generateWithGemini(
  userPrompt: string,
  style: ArtStyle,
  sceneCount: number,
  apiKey: string
): Promise<{ title: string; scenes: StoryScene[]; bgMusic: BgMusicMood }> {
  const systemInstruction = `You are the lead director of Ahadu (አሐዱ) Animation Studio, an elite animation studio blending rich Ethiopian heritage, African folklore, and global animation magic.
Break down the user's story idea into exactly ${sceneCount} sequential animated scenes.
Format your output strictly as a JSON object matching this schema:
{
  "title": "Poetic and memorable story title",
  "bgMusic": "tizita" | "bati" | "ambassel" | "whimsical" | "adventure" | "bedtime",
  "scenes": [
    {
      "title": "Scene title",
      "narration": "Poetic, expressive voiceover narration (2-3 sentences)",
      "visualPrompt": "Detailed visual description of characters, environment, lighting, and action for image generation. Keep character and attire details consistent across scenes.",
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
    title: sc.title || `Chapter ${idx + 1}`,
    narration: sc.narration || '',
    visualPrompt: sc.visualPrompt || userPrompt,
    imageUrl: generateImageUrl(sc.visualPrompt || userPrompt, style, '16:9', 1000 + idx * 83),
    motionType: (sc.motionType as CameraMotion) || CAMERA_SEQUENCE[idx % CAMERA_SEQUENCE.length],
    duration: Math.max(4, Math.min(8, sc.duration || 5)),
  }));

  return {
    title: parsed.title || 'Ahadu Animated Tale',
    bgMusic: (parsed.bgMusic as BgMusicMood) || 'tizita',
    scenes,
  };
}

/**
 * Autonomous Creative Director for Ahadu Studio:
 * Handles Ethiopian folklore, contemporary tales, and global wonder seamlessly.
 */
function generateWithCreativeDirector(
  userPrompt: string,
  style: ArtStyle,
  sceneCount: number
): { title: string; scenes: StoryScene[]; bgMusic: BgMusicMood } {
  const cleanedPrompt = userPrompt.trim();
  const title = deriveTitleFromPrompt(cleanedPrompt);

  // Default to authentic Ethiopian pentatonic modes when Ethiopian styles are selected
  let bgMusic: BgMusicMood = 'tizita';
  const lower = cleanedPrompt.toLowerCase();

  if (style === 'habesha-3d' || style === 'ethiopian-manuscript' || style === 'simien-folktale') {
    if (lower.includes('mountain') || lower.includes('hero') || lower.includes('warrior') || lower.includes('ibex')) {
      bgMusic = 'bati';
    } else if (lower.includes('ancient') || lower.includes('church') || lower.includes('monastery') || lower.includes('castle')) {
      bgMusic = 'ambassel';
    } else {
      bgMusic = 'tizita';
    }
  } else {
    if (lower.includes('adventure') || lower.includes('journey')) {
      bgMusic = 'adventure';
    } else if (lower.includes('sleep') || lower.includes('night') || lower.includes('dream')) {
      bgMusic = 'bedtime';
    } else {
      bgMusic = 'whimsical';
    }
  }

  const baseSeed = Math.floor(Math.random() * 800000);

  const sceneTemplates = [
    {
      stage: 'The Awakening (መነሻ)',
      narrationPattern: (p: string) =>
        `In a timeless realm of beauty and wonder, ${p.toLowerCase().replace(/^(a|an|the)\s+/i, '')}. Beneath skies washed with golden sunlight, a new destiny was quietly born.`,
      visualPrefix: 'Establishing majestic landscape shot, introducing character in traditional attire, warm golden hour sunbeams, atmospheric mist',
      motion: 'zoom-in' as CameraMotion,
      duration: 5,
    },
    {
      stage: 'The Calling (ምሥጢሩ ሲገለጥ)',
      narrationPattern: () =>
        `Guided by ancient whispers and an insatiable spirit of curiosity, a glowing path revealed itself. Every step forward stirred the heart with courage.`,
      visualPrefix: 'Medium shot, character discovering a glowing magical element, expression of profound awe and wonder, radiant ambient lighting',
      motion: 'pan-right' as CameraMotion,
      duration: 5,
    },
    {
      stage: 'The Great Leap (ጀብዱ)',
      narrationPattern: () =>
        `With fear cast aside like dry leaves in the highland breeze, they took flight across the horizon. Wonders never imagined unfolded before their eyes.`,
      visualPrefix: 'Dynamic panoramic angle, breathtaking soaring movement across majestic scenery, vibrant colors, swirling magical particles',
      motion: 'pan-up' as CameraMotion,
      duration: 6,
    },
    {
      stage: 'Harmonious Triumph (ድልና ስምምነት)',
      narrationPattern: () =>
        `And as twilight painted the peaks in violet and gold, laughter echoed through the valley. They realized the truest magic was the love and courage shared along the journey.`,
      visualPrefix: 'Heartwarming cinematic master shot, warm embraces and joyous expressions, glowing sunset backdrop, peaceful harmony',
      motion: 'zoom-out' as CameraMotion,
      duration: 6,
    },
    {
      stage: 'The Eternal Legend (ዘላለማዊ ተረት)',
      narrationPattern: () =>
        `From that day forward, the story was woven into the songs of the elders and whispered to the stars, shining forever bright in the heart of Ahadu.`,
      visualPrefix: 'Twilight star-filled sky overview, peaceful silhouettes overlooking serene highlands, twinkling constellations of wonder',
      motion: 'drift' as CameraMotion,
      duration: 5,
    },
  ];

  const actualCount = Math.min(Math.max(sceneCount, 3), 5);
  const selectedTemplates = sceneTemplates.slice(0, actualCount);

  const scenes: StoryScene[] = selectedTemplates.map((tpl, idx) => {
    const scenePrompt = `${tpl.visualPrefix}, featuring ${cleanedPrompt}`;
    const imageUrl = generateImageUrl(scenePrompt, style, '16:9', baseSeed + idx * 149);

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
  if (words.length === 0) return 'The Legend of Ahadu';
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
