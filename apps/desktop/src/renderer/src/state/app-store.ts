import { create } from "zustand";

type AppState = {
  hasToken: boolean;
  setHasToken: (hasToken: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  hasToken: false,
  setHasToken: (hasToken) => set({ hasToken })
}));

