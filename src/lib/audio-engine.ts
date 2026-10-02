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
        this.gainNode.gain.value = 0.16; // Ambient background volume
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

    // Authentic Ethiopian Pentatonic Qenet (ቅኝት) and global harmonies
    const moodScales: Record<string, number[]> = {
      // Tizita (ትዝታ): Nostalgic Ethiopian pentatonic mode
      tizita: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25],
      // Bati (ባቲ): Majestic, contemplative Ethiopian highland & desert mode
      bati: [261.63, 329.63, 349.23, 392.0, 493.88, 523.25],
      // Ambassel (አምባሰል): Noble, royal Abyssinian storytelling mode
      ambassel: [220.0, 246.94, 261.63, 329.63, 349.23, 440.0],
      // Global moods
      whimsical: [261.63, 329.63, 392.0, 523.25, 659.25],
      adventure: [220.0, 261.63, 293.66, 329.63, 440.0],
      bedtime: [196.0, 246.94, 293.66, 392.0, 440.0],
    };

    const notes = moodScales[mood] || moodScales.tizita;
    let step = 0;

    const playNote = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      const freq = notes[step % notes.length];
      step = (step + 1) % notes.length;

      // Authentic krar/acoustic harp-like pluck curve for Ethiopian modes
      const isEthiopian = ['tizita', 'bati', 'ambassel'].includes(mood);
      osc.type = isEthiopian ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.14, this.ctx.currentTime + (isEthiopian ? 0.05 : 0.3));
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.6);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.7);

      this.timer = setTimeout(playNote, isEthiopian ? 1100 : 1400);
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
 * Speech synthesis with storytelling cadence
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
  utterance.rate = 0.92; // Slightly measured for noble oral storytelling
  utterance.pitch = 1.04;

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
