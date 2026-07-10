import { create } from "zustand";
import type { SubmitResult, View } from "./types";

interface AppState {
  view: View;
  lastResult: SubmitResult | null;
  go: (view: View) => void;
  setLastResult: (r: SubmitResult | null) => void;
}

export const useApp = create<AppState>((set) => ({
  view: { name: "home" },
  lastResult: null,
  go: (view) => {
    set({ view });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  setLastResult: (r) => set({ lastResult: r }),
}));
