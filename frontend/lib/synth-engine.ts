"use client";

type EngineCallbacks = {
  onProgress: (seconds: number) => void;
  onEnded: () => void;
};

const NOTE_FREQUENCIES: Record<string, number> = {
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

const SCALES: string[][] = [
  ["C4", "D4", "E4", "G4", "A4", "C5", "A4", "G4"],
  ["A4", "C5", "D5", "E5", "D5", "C5", "A4", "G4"],
  ["E4", "G4", "A4", "B4", "D5", "B4", "A4", "G4"],
  ["G4", "A4", "B4", "D5", "E5", "D5", "B4", "A4"],
];

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
  private readonly noteDuration = 0.4;
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

  load(songId: string, duration: number, callbacks: EngineCallbacks) {
    this.stopSchedulers();
    this.pattern = SCALES[hashString(songId) % SCALES.length];
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
      this.playNote(this.pattern[this.noteIndex % this.pattern.length], this.nextNoteTime);
      this.nextNoteTime += this.noteDuration;
      this.noteIndex++;
    }
  }

  private playNote(note: string, time: number) {
    if (!this.ctx || !this.masterGain) return;
    const freq = NOTE_FREQUENCIES[note] ?? 440;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(1, time + 0.02);
    gain.gain.linearRampToValueAtTime(0, time + this.noteDuration * 0.9);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + this.noteDuration);
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