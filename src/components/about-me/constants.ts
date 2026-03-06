import { type TerminalMode } from "@/lib/knowledge";

export const timelineData = [
  { year: "About", role: "me", icon: "user" },
  { year: "2023", role: "Frontend Architect", icon: "arch" },
  { year: "2022", role: "UI Engineer", icon: "ui" },
  { year: "2021", role: "Fullstack Developer", icon: "code" },
];

export type AboutHistoryItem = {
  type: "user" | "system";
  content: string;
  isStreaming?: boolean;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function getInitialAboutHistory(mode: TerminalMode): AboutHistoryItem[] {
  return [
    {
      type: "system",
      content: `INITIALIZING IDENTITY_PROTOCOL... MODULE: ${mode.toUpperCase()} MODE ENABLED.`,
    },
    {
      type: "system",
      content: "SYSTEM_STATUS: ONLINE // VERSION: 12.4.0-STABLE",
    },
    { type: "system", content: 'TYPE "help" TO VIEW AVAILABLE COMMANDS.' },
  ];
}
