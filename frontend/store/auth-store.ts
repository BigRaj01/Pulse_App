import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isAuthenticated: boolean;
  email: string | null;
  name: string;
  avatarUrl: string | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updates: { name?: string; avatarUrl?: string }) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      name: "",
      avatarUrl: null,
      login: (email, name) =>
        set({ isAuthenticated: true, email, name: name ?? email.split("@")[0] }),
      logout: () => set({ isAuthenticated: false, email: null, name: "", avatarUrl: null }),
      updateProfile: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    { name: "pulse-auth" }
  )
);