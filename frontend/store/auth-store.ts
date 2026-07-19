import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoredAccount {
  email: string;
  password: string;
  name: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  email: string | null;
  name: string;
  avatarUrl: string | null;
  walletAddress: string | null;
  walletApproved: boolean;
  accounts: StoredAccount[];
  signup: (email: string, password: string, name: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: { name?: string; avatarUrl?: string }) => void;
  setWalletAddress: (address: string | null) => void;
  setWalletApproved: (approved: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      email: null,
      name: "",
      avatarUrl: null,
      walletAddress: null,
      walletApproved: false,
      accounts: [],

      signup: (email, password, name) => {
        const existing = get().accounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase()
        );
        if (existing) {
          return { success: false, error: "An account with this email already exists." };
        }
        set((state) => ({
          accounts: [...state.accounts, { email, password, name }],
          isAuthenticated: true,
          email,
          name,
        }));
        return { success: true };
      },

      login: (email, password) => {
        const account = get().accounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase()
        );
        if (!account) {
          return { success: false, error: "No account found with this email. Please sign up first." };
        }
        if (account.password !== password) {
          return { success: false, error: "Incorrect password." };
        }
        set({ isAuthenticated: true, email: account.email, name: account.name });
        return { success: true };
      },

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