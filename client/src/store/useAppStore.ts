import { create } from 'zustand';

interface AppState {
  phase: string;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useAppStore = create<AppState>((set) => ({
  phase: 'Phase 0 - Foundation Setup',
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}));
