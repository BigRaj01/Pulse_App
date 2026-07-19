import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isAuthenticated: boolean;
  email: string | null;
  name: string;
  avatarUrl: string | null;
  walletAddress: string | null;
  walletApproved: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updates: { name?: string; avatarUrl?: string }) => void;
  setWalletAddress: (address: string | null) => void;
  setWalletApproved: (approved: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
    isAuthenticated: false,
      email: null,
      name: "",
      avatarUrl: null,
      walletAddress: null,
      walletApproved: false,
      login: (email, name) =>
        set({ isAuthenticated: true, email, name: name ?? email.split("@")[0] }),
      logout: () =>
        set({
          isAuthenticated: false,
          email: null,
          name: "",
          avatarUrl: null,
          walletAddress: null,
          walletApproved: false,
        }),
      updateProfile: (updates) => set((state) => ({ ...state, ...updates })),
      setWalletAddress: (address) => set({ walletAddress: address, walletApproved: false }),
      setWalletApproved: (approved) => set({ walletApproved: approved }),
    }),
    { name: "pulse-auth" }
  )
);