import {
  Activity,
  Bug,
  Cloud,
  Fingerprint,
  Globe,
  KeyRound,
  Shield,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import type { Difficulty } from "./types";

export const categoryIconMap: Record<string, LucideIcon> = {
  shield: Shield,
  "key-round": KeyRound,
  globe: Globe,
  bug: Bug,
  fingerprint: Fingerprint,
  activity: Activity,
  cloud: Cloud,
  terminal: Terminal,
};

export function getCategoryIcon(name: string): LucideIcon {
  return categoryIconMap[name] ?? Shield;
}

export const difficultyConfig: Record<
  Difficulty,
  { label: string; className: string; dot: string }
> = {
  Beginner: {
    label: "Beginner",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Intermediate: {
    label: "Intermediate",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  Advanced: {
    label: "Advanced",
    className:
      "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
  },
};

export function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export function formatClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
