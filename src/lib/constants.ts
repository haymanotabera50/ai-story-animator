import { ArtStyleOption, CameraMotion, BgMusicMood } from '@/types/animation';

export const ART_STYLES: ArtStyleOption[] = [
  {
    id: 'habesha-3d',
    name: 'Habesha 3D Animation',
    amharicName: 'ዘመናዊ ሐበሻ 3D',
    description: 'Vibrant Ethiopian 3D animation, authentic Habesha attire with Tibeb embroidery, Disney/Pixar feel',
    previewImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80',
    promptSuffix: '3D animation movie style, authentic Habesha Ethiopian characters wearing traditional white cotton dress with colorful woven Tibeb borders, Ethiopian landscape, vibrant lighting, Pixar Disney 3D quality, highly detailed, 8k render',
  },
  {
    id: 'ethiopian-manuscript',
    name: 'Ancient Biranna Parchment (ብራና)',
    amharicName: 'የጥንት የብራና ሥዕል',
    description: 'Traditional Ethiopian church fresco & manuscript art, warm golden parchment, mineral pigments, bold almond eyes',
    previewImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80',
    promptSuffix: 'authentic Ethiopian ancient church illuminated manuscript painting style, traditional Abyssinian fresco, warm textured parchment paper, natural mineral ochre, vermilion and cobalt pigments, sacred folk art aesthetic, bold outlines, expressive almond eyes, masterpiece',
  },
  {
    id: 'simien-folktale',
    name: 'Simien Highlands Anime',
    amharicName: 'የስሜን ተራሮች አኒሜ',
    description: 'Studio Ghibli anime style in the majestic Ethiopian highlands with misty cliffs, acacia trees & folklore',
    previewImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    promptSuffix: 'Studio Ghibli aesthetic anime film set in the Ethiopian Simien Mountains highlands, dramatic rock pinnacles, giant lobelias and acacia trees, warm golden sunlight, hand-painted anime background, Hayao Miyazaki aesthetic, breathtaking',
  },
  {
    id: 'pixar-3d',
    name: 'Classic 3D Pixar',
    amharicName: 'ዓለም አቀፍ 3D ፒክሳር',
    description: 'Vibrant, rich volumetric lighting, cute expressive characters, Disney/Pixar movie feel',
    previewImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    promptSuffix: 'Pixar Disney 3D animation movie style, vibrant colors, volumetric lighting, subsurface scattering, expressive characters, cute, cinematic 3D render, highly detailed, 8k',
  },
  {
    id: 'ghibli-anime',
    name: 'Studio Ghibli Anime',
    amharicName: 'ጊብሊ አኒሜ',
    description: 'Hand-drawn anime aesthetic, lush painted backgrounds, nostalgic and whimsical vibe',
    previewImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    promptSuffix: 'Studio Ghibli anime style, Hayao Miyazaki inspired, hand painted background, watercolor textures, soft sunbeams, whimsical dreamy atmosphere, high aesthetic masterpiece',
  },
  {
    id: 'watercolor',
    name: 'Watercolor Storybook',
    amharicName: 'የልጆች ተረት ሥዕል',
    description: 'Classic children’s storybook illustration with soft pastel washes and gentle lineart',
    previewImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80',
    promptSuffix: 'storybook watercolor painting, ink and wash, gentle soft textures, nostalgic children picture book illustration, pastel colors, cozy aesthetic',
  },
  {
    id: 'comic-book',
    name: 'Afro-Comic / Pop Art',
    amharicName: 'ተለዋዋጭ ኮሚክ',
    description: 'Bold black inking, halftone dot patterns, vibrant saturated colors, graphic novel style',
    previewImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80',
    promptSuffix: 'modern comic book art, bold dynamic ink lineart, vibrant saturated colors, halftone textures, dramatic lighting, graphic novel illustration, stylish',
  },
];

export const CAMERA_MOTIONS: { id: CameraMotion; label: string; iconName: string; description: string }[] = [
  { id: 'zoom-in', label: 'Zoom In (ማቅረብ)', iconName: 'ZoomIn', description: 'Smoothly closes in on the focal subject' },
  { id: 'zoom-out', label: 'Zoom Out (ማራቅ)', iconName: 'ZoomOut', description: 'Reveals the broader landscape' },
  { id: 'pan-left', label: 'Pan Left (ወደ ግራ)', iconName: 'ArrowLeft', description: 'Glides horizontally to the left' },
  { id: 'pan-right', label: 'Pan Right (ወደ ቀኝ)', iconName: 'ArrowRight', description: 'Glides horizontally to the right' },
  { id: 'pan-up', label: 'Tilt Up (ወደ ላይ)', iconName: 'ArrowUp', description: 'Rises from ground to sky' },
  { id: 'drift', label: 'Floating Drift (ተንሳፋፊ)', iconName: 'Compass', description: 'Gentle organic camera sway' },
];

export const ETHIOPIAN_MUSIC_MODES: { id: BgMusicMood; label: string; amharic: string; description: string }[] = [
  { id: 'tizita', label: 'Tizita (ትዝታ)', amharic: 'ትዝታ ቅኝት', description: 'Nostalgic, soul-stirring Ethiopian pentatonic scale' },
  { id: 'bati', label: 'Bati (ባቲ)', amharic: 'ባቲ ቅኝት', description: 'Majestic mountain & desert Abyssinian mode' },
  { id: 'ambassel', label: 'Ambassel (አምባሰል)', amharic: 'አምባሰል ቅኝት', description: 'Regal, heroic highland modal progression' },
  { id: 'whimsical', label: 'Whimsical Wonder', amharic: 'የደስታ ዜማ', description: 'Playful and bright storybook melody' },
  { id: 'adventure', label: 'Epic Adventure', amharic: 'የጀብዱ ዜማ', description: 'Heroic quest rhythm and strings' },
  { id: 'bedtime', label: 'Gentle Bedtime', amharic: 'የእረፍት ዜማ', description: 'Soothing twilight lullaby' },
  { id: 'none', label: 'Mute (ድምፅ አልባ)', amharic: 'ያለ ሙዚቃ', description: 'Voice narration only' },
];

export const SAMPLE_PROMPTS = [
  {
    title: '☕ Kaldi & The Dancing Goats',
    amharicTitle: 'ካልዲና የቡናው ተረት',
    prompt: 'A young Ethiopian shepherd boy named Kaldi in ancient Kaffa discovers his lively goats dancing with joy under wild coffee trees with glowing red cherries.',
    style: 'habesha-3d' as const,
  },
  {
    title: '⛰️ Starlit Shepherd of Simien',
    amharicTitle: 'የስሜኑ እረኛ',
    prompt: 'A brave young girl wearing a traditional Habesha dress with vibrant Tibeb borders guides a lost golden baby Walia Ibex through the mystical peaks of the Simien Mountains under shining stars.',
    style: 'simien-folktale' as const,
  },
  {
    title: '🏰 The Secret of Gondar Castle',
    amharicTitle: 'የፋሲል ግቢ ምስጢር',
    prompt: 'A curious boy explores an ancient hidden room inside Gondar Castle and discovers a floating illuminated parchment book (Biranna) that brings ancient Ethiopian legends to life.',
    style: 'ethiopian-manuscript' as const,
  },
  {
    title: '⛵ Papyrus Boat of Lake Tana',
    amharicTitle: 'የጣና ሀይቅ ታንኳ',
    prompt: 'A young fisherman navigates Lake Tana on a traditional papyrus tankwa at sunset, guided by a glowing white pelican to an ancient hidden island monastery.',
    style: 'habesha-3d' as const,
  },
];
