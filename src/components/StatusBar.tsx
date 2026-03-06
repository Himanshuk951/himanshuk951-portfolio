"use client";

import { motion } from "framer-motion";
import { GitBranch, Wifi, Hash, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function StatusBar({
  activeSection = "main",
}: {
  activeSection?: string;
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
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
  }, []);

  // random non-changing git hash for aesthetic
  const gitHash = "4f2a7d8";

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
