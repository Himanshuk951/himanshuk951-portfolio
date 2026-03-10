import { type TerminalMode } from "@/lib/knowledge";

export type ContactHistoryItem = {
  type: "user" | "system";
  content: string;
  isStreaming?: boolean;
  status?: "success" | "error" | "info";
};

export const initialSystemStats = {
  cpu: 24,
  ram: 42,
  signal: 98,
};

export function getInitialContactHistory(
  mode: TerminalMode,
): ContactHistoryItem[] {
  return [
    {
      type: "system",
      content: `INITIALIZING_CYBER_HUB... READY FOR HANDSHAKE. MODE: ${mode.toUpperCase()}`,
    },
    {
      type: "system",
      content: "CURRENTLY AVAILABLE FOR NEW ADVENTURES. SAY HELLO!",
    },
  ];
}
