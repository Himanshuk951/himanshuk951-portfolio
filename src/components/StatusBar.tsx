"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, Wifi, Hash, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function StatusBar({
  activeSection = "main",
  variant = "github",
}: {
  activeSection?: string;
  variant?: "github" | "bottom";
}) {
  const [time, setTime] = useState("");
  const footerLines = [
    "You've reached the bottom. There's no more scrolling.",
    "Don't be a stranger, unless you're a robot. Then maybe be a stranger.",
    "Is it me you're looking for? 🎵",
    "Still here? We should probably be friends by now.",
  ];
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (variant !== "github") return;
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [variant]);

  useEffect(() => {
    if (variant !== "bottom") return;
    const interval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % footerLines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [variant, footerLines.length]);

  const gitHash = "4f2a7d8";

  if (variant === "bottom") {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#090909]/95 z-[100] px-3 py-2 font-mono text-[10px] select-none backdrop-blur-md"
      >
        <div className="grid w-full gap-1 md:grid-cols-3 md:items-center">
          <div className="text-zinc-400 text-center md:text-left text-[10px] md:text-xs font-semibold tracking-[0.16em] uppercase flex items-center justify-center md:justify-start gap-1.5">
            <span className="text-base md:text-lg leading-none">©</span>
            <span>HIMANSHU KUMAR 2026</span>
          </div>
          <div className="text-zinc-300 text-center">[DESIGNED BY HIMANSHU]</div>
          <div className="text-zinc-500 text-center md:text-right min-h-[1.25rem]">
            <AnimatePresence mode="wait">
              <motion.span
                key={lineIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-block"
              >
                {footerLines[lineIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 h-7 bg-[#0a0a0a] border-t border-white/5 z-[100] flex items-center justify-between px-3 font-mono text-[10px] select-none"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-accent-blue font-bold">
          <GitBranch className="w-3 h-3" />
          <span>branch:{activeSection}</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Hash className="w-3 h-3" />
          <span>commit:{gitHash}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-green-500/50" />
          <span>LATENCY: 12ms</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-1.5 font-bold text-zinc-400">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
      </div>
    </motion.div>
  );
}
