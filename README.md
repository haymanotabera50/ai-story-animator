# StoryMorph — AI Animation & Cartoon Studio 🎬✨

An AI-powered web studio that turns any text prompt or story idea into a fully voiced, animated cartoon video with dynamic camera motion, synchronized subtitles, background music, and instant video download.

## 🚀 Features

- **Prompt-to-Cartoon Pipeline**: Enter any story concept, select an art style, and generate structured scenes automatically.
- **6 Art Styles**:
  - 🎨 3D Pixar / Disney Animation
  - 🍃 Studio Ghibli Anime
  - 📖 Classic Watercolor Storybook
  - 💥 Dynamic Comic Book / Pop Art
  - 🧸 Cozy Stop-Motion Claymation
  - ✨ Enchanted Fantasy
- **Cinema Theater Player**:
  - Smooth Ken Burns camera motion (Zoom In, Zoom Out, Pan Left, Pan Right, Tilt Up, Drift).
  - Ambient Web Audio soundtrack synthesizer matching the story mood (Whimsical, Adventure, Bedtime, Cyberpunk).
  - Web Speech synthesis voiceover narration.
  - Floating high-contrast cinema subtitles.
- **Scene Director & Storyboard**:
  - Edit scene narration in real-time.
  - Re-generate scene illustrations with customized seeds and prompts.
  - Adjust scene durations and camera movements.
  - Add or delete scenes.
- **Instant Video Export**:
  - Client-side 60fps canvas renderer & MediaRecorder engine.
  - Exports directly to high-definition video (`.webm` / `.mp4`) without needing external rendering servers.
- **Zero-Setup Operation**:
  - Pre-configured with free, high-speed Flux image generation via Pollinations.ai and client-side audio synthesis.
  - Optional: Plug in your Google Gemini API key in the Settings modal for personalized LLM scriptwriting.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API + SpeechSynthesis
- **Video Engine**: HTML5 2D Canvas + MediaStream / MediaRecorder

## 🏃 Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
