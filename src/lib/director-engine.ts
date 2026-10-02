import { StoryAngle, FullStoryScript, ScriptScene } from '@/types/director';
import { ArtStyle, CameraMotion, BgMusicMood } from '@/types/animation';
import { generateImageUrl } from './image-generator';

const CAMERA_CYCLE: CameraMotion[] = ['zoom-in', 'pan-right', 'zoom-out', 'pan-left', 'pan-up', 'drift'];

export function brainstormStoryAngles(userPrompt: string): {
  directorGreeting: string;
  angles: StoryAngle[];
} {
  const p = userPrompt.trim();
  const lower = p.toLowerCase();

  // Detect cultural or thematic hints
  const isHighland = lower.includes('mountain') || lower.includes('simien') || lower.includes('ibex');
  const isCoffee = lower.includes('coffee') || lower.includes('kaldi') || lower.includes('bean');
  const isRoyal = lower.includes('castle') || lower.includes('gondar') || lower.includes('axum') || lower.includes('king');

  const greeting = `Selam! I'm your Ahadu AI Director. What a fantastic premise — "${p}"! Let's shape this into an unforgettable animated short. I've engineered 3 distinct creative directions for you to choose from:`;

  const angles: StoryAngle[] = [
    {
      id: 'angle-1',
      title: isCoffee ? 'The Legend of the Golden Brew' : isHighland ? 'The Whispering Mist of Simien' : 'The Heart of Wonder',
      amharicTitle: isCoffee ? 'የወርቃማው ቡና ተረት' : 'የስሜን ተራሮች ምሥጢር',
      hook: 'A heartwarming, mythical narrative rich in Ethiopian cultural warmth and tender character moments.',
      recommendedStyle: 'habesha-3d' as ArtStyle,
      recommendedMusic: 'tizita' as BgMusicMood,
      synopsis: `Follow our protagonist as they discover that extraordinary magic hides within ordinary daily life, told with lush 3D Habesha animation and soulful Tizita melodies.`,
    },
    {
      id: 'angle-2',
      title: isRoyal ? 'The Lost Chronicles of Gondar' : 'The Skyward Journey',
      amharicTitle: 'የጀብዱ ጉዞ',
      hook: 'A high-energy, dynamic quest with soaring panoramic camera sweeps and heroic courage.',
      recommendedStyle: 'simien-folktale' as ArtStyle,
      recommendedMusic: 'bati' as BgMusicMood,
      synopsis: `An adventurous journey facing high-altitude winds and ancient puzzles, filled with breathtaking mountain vistas and rhythmic Bati pacing.`,
    },
    {
      id: 'angle-3',
      title: 'The Starlight Illuminated Tale',
      amharicTitle: 'የብራናው ምስጢር',
      hook: 'A sacred illuminated manuscript aesthetic inspired by ancient Biranna church frescoes and timeless wisdom.',
      recommendedStyle: 'ethiopian-manuscript' as ArtStyle,
      recommendedMusic: 'ambassel' as BgMusicMood,
      synopsis: `Rendered with ancient gold leaf parchment textures, deep mineral ochres, and majestic Ambassel storytelling chords that evoke ancient Abyssinian history.`,
    },
  ];

  return { directorGreeting: greeting, angles };
}

export function generateScriptFromAngle(
  angle: StoryAngle,
  rawPrompt: string,
  sceneCount: number = 4
): FullStoryScript {
  const count = Math.min(Math.max(sceneCount, 3), 5);
  const baseSeed = Math.floor(Math.random() * 900000);

  const sceneTemplates = [
    {
      title: 'Act I: The Golden Dawn (መነሻ)',
      narration: `Beneath skies brushed in rose and amber, ${rawPrompt.toLowerCase().replace(/^(a|an|the)\s+/i, '')}. What began as a peaceful morning was about to unveil a wondrous secret.`,
      visualDirection: `Establishing cinematic wide shot, warm sunbeams illuminating traditional Habesha attire with vibrant woven Tibeb embroidery, tranquil highlands in the backdrop`,
      cameraMotion: 'zoom-in' as CameraMotion,
      duration: 5,
    },
    {
      title: 'Act II: The Hidden Calling (ጥሪው)',
      narration: `Drawn by an ancient glow, our hero uncovered a path never walked before. Every whisper of the mountain breeze urged their heart forward with unshakable courage.`,
      visualDirection: `Medium close-up shot, character eyes wide with awe, magical glowing particles reflecting upon their face, atmospheric morning mist`,
      cameraMotion: 'pan-right' as CameraMotion,
      duration: 5,
    },
    {
      title: 'Act III: Soaring Horizons (ጀብዱ)',
      narration: `With doubts left behind like autumn leaves, they took a breathtaking leap toward the stars. The world opened its arms in panoramic majesty.`,
      visualDirection: `Dynamic low-angle action shot, soaring flight across towering cliffs and glowing canyons, vibrant colors, swirling wind effects`,
      cameraMotion: 'pan-up' as CameraMotion,
      duration: 6,
    },
    {
      title: 'Act IV: Eternal Harmony (ድልና ስምምነት)',
      narration: `And as twilight bathed the earth in violet and starlight, laughter echoed across the horizon. True magic was never the destination, but the love shared along the journey.`,
      visualDirection: `Golden hour master conclusion, warm embraces and joyous celebrations, silhouette against a stunning African sunset, serene starlight`,
      cameraMotion: 'zoom-out' as CameraMotion,
      duration: 6,
    },
    {
      title: 'Act V: The Living Legacy (ዘላለማዊ ተረት)',
      narration: `From that day forth, the legend was etched into the songs of the elders and whispered to the night sky, forever shining in the heart of Ahadu.`,
      visualDirection: `Star-filled twilight sky overview, twinkling constellations forming ancient symbols, peaceful glowing horizon`,
      cameraMotion: 'drift' as CameraMotion,
      duration: 5,
    },
  ];

  const chosenTemplates = sceneTemplates.slice(0, count);

  const scenes: ScriptScene[] = chosenTemplates.map((t, idx) => ({
    id: `scene-${Date.now()}-${idx}`,
    order: idx + 1,
    title: t.title,
    narration: t.narration,
    visualDirection: t.visualDirection,
    imageUrl: generateImageUrl(t.visualDirection, angle.recommendedStyle, '16:9', baseSeed + idx * 79),
    cameraMotion: t.cameraMotion || CAMERA_CYCLE[idx % CAMERA_CYCLE.length],
    duration: t.duration,
  }));

  return {
    title: angle.title,
    amharicTitle: angle.amharicTitle,
    logline: angle.synopsis,
    style: angle.recommendedStyle,
    aspectRatio: '16:9',
    musicMode: angle.recommendedMusic,
    voiceSpeed: 0.95,
    voicePitch: 1.04,
    scenes,
  };
}

export function refineScriptWithFeedback(
  current: FullStoryScript,
  instruction: string
): FullStoryScript {
  const lower = instruction.toLowerCase();

  const updatedScenes = current.scenes.map((sc, idx) => {
    let narration = sc.narration;
    if (lower.includes('funn') || lower.includes('playful')) {
      narration = sc.narration.replace(/unshakeable courage|ancient glow/gi, 'unexpected giggles and clumsy steps');
    } else if (lower.includes('action') || lower.includes('dramatic')) {
      narration = `With a thunderous heartbeat and blazing resolve, ${sc.narration}`;
    }
    return {
      ...sc,
      narration,
    };
  });

  return {
    ...current,
    scenes: updatedScenes,
  };
}
