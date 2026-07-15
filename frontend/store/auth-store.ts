import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  email: string | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  email: null,
  login: (email) => set({ isAuthenticated: true, email }),
  logout: () => set({ isAuthenticated: false, email: null }),
}));