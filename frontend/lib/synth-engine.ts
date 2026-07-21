"use client";

type EngineCallbacks = {
  onProgress: (seconds: number) => void;
  onEnded: () => void;
};

const NOTE_FREQUENCIES: Record<string, number> = {
  E3: 164.81,
  G3: 196.0,
  A3: 220.0,
  "A#3": 233.08,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

interface GenrePreset {
  patterns: string[][];
  bass: string[];
  waveform: OscillatorType;
  noteDuration: number;
}

const GENRE_PRESETS: Record<string, GenrePreset> = {
  Electronic: {
    patterns: [
      ["C4", "E4", "G4", "C5", "G4", "E4", "D4", "G4"],
      ["E4", "G4", "B4", "E5", "D5", "B4", "G4", "D4"],
    ],
    bass: ["E3", "G3"],
    waveform: "sawtooth",
    noteDuration: 0.22,
  },
  Indie: {
    patterns: [
      ["A4", "C5", "E5", "D5", "C5", "A4", "G4", "A4"],
      ["D4", "F4", "A4", "G4", "F4", "D4", "C4", "D4"],
    ],
    bass: ["A3", "D4"],
    waveform: "triangle",
    noteDuration: 0.35,
  },
  "R&B": {
    patterns: [
      ["D4", "F4", "A4", "C5", "A4", "F4", "D4", "C4"],
      ["G4", "A#3", "D4", "F4", "D4", "A#3", "G3", "D4"],
    ],
    bass: ["D4", "A3"],
    waveform: "sine",
    noteDuration: 0.5,
  },
  Pop: {
    patterns: [
      ["E4", "G4", "B4", "E5", "D5", "B4", "G4", "E4"],
      ["C4", "E4", "G4", "C5", "B4", "G4", "E4", "C4"],
    ],
    bass: ["C4", "G3"],
    waveform: "square",
    noteDuration: 0.28,
  },
  "Hip-Hop": {
    patterns: [
      ["G3", "G3", "A#3", "C4", "D4", "C4", "A#3", "G3"],
      ["E3", "G3", "A3", "C4", "A3", "G3", "E3", "G3"],
    ],
    bass: ["G3", "E3"],
    waveform: "sawtooth",
    noteDuration: 0.4,
  },
  Ambient: {
    patterns: [
      ["C4", "E4", "G4", "B4", "C5", "B4", "G4", "E4"],
      ["A3", "C4", "E4", "A4", "G4", "E4", "C4", "A3"],
    ],
    bass: ["A3", "E3"],
    waveform: "sine",
    noteDuration: 0.7,
  },
};

const DEFAULT_PRESET: GenrePreset = {
  patterns: [["C4", "D4", "E4", "G4", "A4", "C5", "A4", "G4"]],
  bass: ["C4"],
  waveform: "sine",
  noteDuration: 0.4,
};

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) % 100000;
  }
  return hash;
}

class SynthEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private schedulerTimer: ReturnType<typeof setInterval> | null = null;
  private progressTimer: ReturnType<typeof setInterval> | null = null;
  private nextNoteTime = 0;
  private noteIndex = 0;
  private pattern: string[] = [];
  private bass: string[] = [];
  private waveform: OscillatorType = "sine";
  private noteDuration = 0.4;
  private startedAt = 0;
  private offsetSeconds = 0;
  private duration = 0;
  private callbacks: EngineCallbacks | null = null;

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.15;
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  load(songId: string, duration: number, genre: string, callbacks: EngineCallbacks) {
    this.stopSchedulers();
    const preset = GENRE_PRESETS[genre] ?? DEFAULT_PRESET;
    const hash = hashString(songId);

    const variant = preset.patterns[hash % preset.patterns.length];
    const rotation = hash % variant.length;
    this.pattern = [...variant.slice(rotation), ...variant.slice(0, rotation)];
    this.bass = preset.bass;
    this.waveform = preset.waveform;
    this.noteDuration = preset.noteDuration;
    this.duration = duration;
    this.offsetSeconds = 0;
    this.callbacks = callbacks;
  }

  setVolume(volume: number) {
    this.ensureContext();
    if (this.masterGain) this.masterGain.gain.value = volume * 0.2;
  }

  play(fromSeconds?: number) {
    if (this.pattern.length === 0) return;
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") ctx.resume();
    this.stopSchedulers();
    if (typeof fromSeconds === "number") {
      this.offsetSeconds = fromSeconds;
    }
    this.startedAt = ctx.currentTime;
    this.noteIndex =
      Math.floor(this.offsetSeconds / this.noteDuration) % this.pattern.length;
    this.nextNoteTime = ctx.currentTime + 0.05;
    this.schedulerTimer = setInterval(() => this.scheduler(), 100);
    this.progressTimer = setInterval(() => this.tickProgress(), 250);
  }

  pause() {
    if (this.ctx && this.schedulerTimer) {
      const elapsed = this.offsetSeconds + (this.ctx.currentTime - this.startedAt);
      this.offsetSeconds = Math.min(elapsed, this.duration);
    }
    this.stopSchedulers();
    this.ctx?.suspend();
  }

  seek(seconds: number) {
    const wasPlaying = this.schedulerTimer !== null;
    if (wasPlaying) {
      this.play(seconds);
    } else {
      this.offsetSeconds = seconds;
    }
  }

  stop() {
    this.stopSchedulers();
    this.offsetSeconds = 0;
  }

  private stopSchedulers() {
    if (this.schedulerTimer) clearInterval(this.schedulerTimer);
    if (this.progressTimer) clearInterval(this.progressTimer);
    this.schedulerTimer = null;
    this.progressTimer = null;
  }

  private scheduler() {
    if (!this.ctx) return;
    while (this.nextNoteTime < this.ctx.currentTime + 0.2) {
      const barPosition = this.noteIndex % this.pattern.length;
      this.playNote(this.pattern[barPosition], this.nextNoteTime, "lead");

      if (barPosition % 4 === 0) {
        const bassNote = this.bass[Math.floor(this.noteIndex / 4) % this.bass.length];
        this.playNote(bassNote, this.nextNoteTime, "bass");
      }

      this.nextNoteTime += this.noteDuration;
      this.noteIndex++;
    }
  }

  private playNote(note: string, time: number, voice: "lead" | "bass") {
    if (!this.ctx || !this.masterGain) return;
    const freq = NOTE_FREQUENCIES[note] ?? 440;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = voice === "bass" ? "sine" : this.waveform;
    osc.frequency.value = voice === "bass" ? freq / 2 : freq;

    const peak = voice === "bass" ? 0.5 : 1;
    const noteLen = voice === "bass" ? this.noteDuration * 4 : this.noteDuration;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(peak, time + 0.02);
    gain.gain.linearRampToValueAtTime(0, time + noteLen * 0.9);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + noteLen);
  }

  private tickProgress() {
    if (!this.ctx) return;
    const elapsed = this.offsetSeconds + (this.ctx.currentTime - this.startedAt);
    if (elapsed >= this.duration) {
      this.stopSchedulers();
      this.callbacks?.onEnded();
      return;
    }
    this.callbacks?.onProgress(elapsed);
  }
}

export const synthEngine = new SynthEngine();