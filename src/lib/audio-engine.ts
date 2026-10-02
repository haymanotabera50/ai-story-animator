import { BgMusicMood } from '@/types/animation';

class AmbientSoundtrack {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: any = null;
  private gainNode: GainNode | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = 0.15; // Ambient background volume
        this.gainNode.connect(this.ctx.destination);
      }
    }
  }

  public playMood(mood: BgMusicMood) {
    if (mood === 'none' || typeof window === 'undefined') {
      this.stop();
      return;
    }

    this.initContext();
    if (!this.ctx || !this.gainNode) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) this.stop();
    this.isPlaying = true;

    // Define harmonic progressions based on mood
    const moodScales: Record<string, number[]> = {
      whimsical: [261.63, 329.63, 392.0, 523.25, 659.25], // C major pentatonic
      adventure: [220.0, 261.63, 293.66, 329.63, 440.0], // A minor / cinematic
      bedtime: [196.0, 246.94, 293.66, 392.0, 440.0], // G gentle lullaby
      cyberpunk: [146.83, 174.61, 220.0, 246.94, 293.66], // D synthwave
    };

    const notes = moodScales[mood] || moodScales.whimsical;
    let step = 0;

    const playNote = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      const freq = notes[step % notes.length];
      step = (step + 1) % notes.length;

      osc.type = mood === 'cyberpunk' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 0.4);
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.4);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.5);

      this.timer = setTimeout(playNote, 1400);
    };

    playNote();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }
}

export const ambientSoundtrack = new AmbientSoundtrack();

/**
 * Speech synthesis with word tracking for subtitles
 */
export function speakNarration(
  text: string,
  onEnd?: () => void,
  onWord?: (charIndex: number) => void
): { stop: () => void } {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) setTimeout(onEnd, 3000);
    return { stop: () => {} };
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // slightly slower for cinematic storytelling
  utterance.pitch = 1.05; // warm, engaging tone

  // Attempt to select a natural voice
  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(
    (v) =>
      v.name.includes('Natural') ||
      v.name.includes('Google') ||
      v.name.includes('Samantha') ||
      v.name.includes('Karen') ||
      v.lang.startsWith('en')
  );
  if (naturalVoice) utterance.voice = naturalVoice;

  if (onWord) {
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        onWord(event.charIndex);
      }
    };
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      window.speechSynthesis.cancel();
    },
  };
}

