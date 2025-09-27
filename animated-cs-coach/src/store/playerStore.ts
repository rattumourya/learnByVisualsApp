import { create } from 'zustand';

import type { PlayerState } from '../lib/types';

interface PlayerStore extends PlayerState {
  setStatus: (status: PlayerState['status']) => void;
  setIndex: (index: number) => void;
  setElapsed: (elapsedMs: number) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
}

const initialState: PlayerState = {
  status: 'idle',
  currentIndex: 0,
  elapsedMs: 0,
  speed: 1
};

export const usePlayerStore = create<PlayerStore>((set) => ({
  ...initialState,
  setStatus: (status) => set({ status }),
  setIndex: (currentIndex) => set({ currentIndex }),
  setElapsed: (elapsedMs) => set({ elapsedMs }),
  setSpeed: (speed) => set({ speed }),
  reset: () => set(initialState)
}));

export function usePlayerState() {
  return usePlayerStore((state) => state);
}
