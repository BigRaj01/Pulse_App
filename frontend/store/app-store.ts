import { create } from "zustand";
import { Song } from "@/types";

interface AppStore {
  theme: "dark" | "light";
  walletBalanceVisible: boolean;
  favorites: Song[];

  toggleTheme: () => void;
  toggleWalletVisibility: () => void;
  addFavorite: (song: Song) => void;
  removeFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
}

export const useAppStore = create<AppStore>((set, get) => ({
  theme: "dark",
  walletBalanceVisible: true,
  favorites: [],

  toggleTheme: () =>
    set({ theme: get().theme === "dark" ? "light" : "dark" }),

  toggleWalletVisibility: () =>
    set({ walletBalanceVisible: !get().walletBalanceVisible }),

  addFavorite: (song) => set({ favorites: [...get().favorites, song] }),

  removeFavorite: (songId) =>
    set({ favorites: get().favorites.filter((s) => s.id !== songId) }),

  isFavorite: (songId) => get().favorites.some((s) => s.id === songId),
}));