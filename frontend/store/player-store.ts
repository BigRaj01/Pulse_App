import { create } from "zustand";
import { Song, RepeatMode } from "@/types";

interface PlayerStore {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  shuffle: boolean;
  repeat: RepeatMode;

  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  shuffle: false,
  repeat: "off",

  playSong: (song, queue) =>
    set({
      currentSong: song,
      queue: queue ?? get().queue,
      isPlaying: true,
      progress: 0,
    }),

  togglePlay: () => set({ isPlaying: !get().isPlaying }),

  setVolume: (volume) => set({ volume }),

  setProgress: (progress) => set({ progress }),

  toggleShuffle: () => set({ shuffle: !get().shuffle }),

  cycleRepeat: () => {
    const order: RepeatMode[] = ["off", "all", "one"];
    const next = order[(order.indexOf(get().repeat) + 1) % order.length];
    set({ repeat: next });
  },

  playNext: () => {
    const { queue, currentSong } = get();
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    set({ currentSong: queue[nextIndex], progress: 0, isPlaying: true });
  },

  playPrevious: () => {
    const { queue, currentSong } = get();
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    set({ currentSong: queue[prevIndex], progress: 0, isPlaying: true });
  },
}));