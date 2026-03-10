"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Cpu, Zap, Signal, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMatrixCanvas } from "@/hooks/useMatrixCanvas";
import {
  getInitialContactHistory,
  initialSystemStats,
  type ContactHistoryItem as HistoryItem,
} from "@/components/terminal-contact/constants";
import {
  SOCIAL_COMMAND_ALIASES,
  SOCIAL_MEDIA_LINKS,
  SOCIAL_MEDIA_LIST,
} from "@/lib/social";

import { type TerminalMode } from "@/lib/knowledge";

export default function TerminalContact({
  onBack,
  mode = "code",
}: {
  onBack?: () => void;
  mode?: TerminalMode;
}) {
  const renderLinkifiedText = (text: string) => {
    const parts = text.split(/(https?:\/\/[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.match(/^https?:\/\/[^\s]+$/)) {
        return (
          <a
            key={`${part}-${index}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue underline underline-offset-2 hover:text-blue-300 break-all"
          >
            {part}
          </a>
        );
      }

      return <Fragment key={`text-${index}`}>{part}</Fragment>;
    });
  };

  const [history, setHistory] = useState<HistoryItem[]>(
    getInitialContactHistory(mode),
  );
  const [input, setInput] = useState("");
  const [isMatrix, setIsMatrix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // contact state machine
  const [step, setStep] = useState<
    "idle" | "confirm" | "email" | "message" | "ready_to_push"
  >("idle");
  const [contactData, setContactData] = useState({ email: "", message: "" });

  const [systemStats, setSystemStats] = useState(initialSystemStats);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useMatrixCanvas(isMatrix);

  // simulate fluctuating system stats
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * (45 - 12) + 12),
        ram: Math.floor(Math.random() * (62 - 38) + 38),
        signal: Math.floor(Math.random() * (100 - 92) + 92),
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const focusInput = () => inputRef.current?.focus();

  const streamResponse = async (
    text: string,
    status: "success" | "error" | "info" = "info",
  ) => {
    setHistory((prev) => [
      ...prev,
      { type: "system", content: "", isStreaming: true, status },
    ]);

    for (let i = 0; i < text.length; i++) {
      const currentContent = text.slice(0, i + 1);
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].content = currentContent;
        return newHistory;
      });
      await new Promise((r) => setTimeout(r, 25));
    }

    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1].isStreaming = false;
      return newHistory;
    });
  };

  const runCommand = async (cmd: string) => {
    const rawInput = cmd.trim();
    const query = rawInput.toLowerCase();
    if (!rawInput) return;

    setHistory((prev) => [...prev, { type: "user", content: rawInput }]);
    setInput("");
    setCursorPos(0);
    setIsProcessing(true);

    // COMMANDS (work in any step) ---
    if (query === "clear") {
      setHistory([
        {
          type: "system",
          content: `BUFFER_PURGED. MODE: ${mode.toUpperCase()}. READY.`,
        },
      ]);
      setStep("idle");
      setContactData({ email: "", message: "" });
      setIsProcessing(false);
      return;
    }

    if (query === "back") {
      await streamResponse("TERMINATING_HANDSHAKE_SESSION... [SUCCESS]");
      await streamResponse(
        "RE-ROUTING NEURAL_LINK TO ORIGIN... DISCONNECTING.",
      );
      await new Promise((r) => setTimeout(r, 800));
      onBack?.();
      setIsProcessing(false);
      return;
    }

    // STATE MACHINE LOGIC ---
    if (step === "idle") {
      if (query === "hi" || query === "hello") {
        await streamResponse(
          "Would you like to contact Himanshu? (yes/no)",
          "info",
        );
        setStep("confirm");
      } else if (query === "help") {
        await streamResponse(
          "PROTOCOL_DIRECTORY:\n- hi / hello / Hi / Hello :: initiate handshake\n- socialmedia / social media / social :: list all social links\n- instagram | linkedin | x | github | gethub :: get one social link\n- back :: return to origin\n- matrix :: run neural override\n- clear :: purge buffer",
        );
      } else if (
        query === "socialmedia" ||
        query === "social media" ||
        query === "social" ||
        query === "socal media"
      ) {
        await streamResponse(
          `SOCIAL_MEDIA_LINKS:\n${SOCIAL_MEDIA_LIST}`,
          "info",
        );
      } else if (query in SOCIAL_COMMAND_ALIASES) {
        const platform =
          SOCIAL_COMMAND_ALIASES[query as keyof typeof SOCIAL_COMMAND_ALIASES];
        await streamResponse(
          `${platform.toUpperCase()} :: ${SOCIAL_MEDIA_LINKS[platform]}`,
          "success",
        );
      } else if (query === "matrix") {
        setIsMatrix(true);
        setTimeout(() => setIsMatrix(false), 5000);
        await streamResponse(
          "NEURAL_OVERRIDE_ACTIVE. SYSTEM_RE_ROUTING...",
          "info",
        );
      } else {
        await streamResponse(
          `[ERROR]: Command not found. Try "help".`,
          "error",
        );
      }
    } else if (step === "confirm") {
      if (query === "yes" || query === "y") {
        await streamResponse(
          "IDENTITY_CONFIRMED. Please enter your EMAIL address:",
          "success",
        );
        setStep("email");
      } else {
        await streamResponse("HANDSHAKE_ABORTED. Returning to IDLE.", "info");
        setStep("idle");
      }
    } else if (step === "email") {
      setContactData((prev) => ({ ...prev, email: rawInput }));
      await streamResponse(
        "EMAIL_CAPTURED. Please enter your MESSAGE:",
        "info",
      );
      setStep("message");
    } else if (step === "message") {
      setContactData((prev) => ({ ...prev, message: rawInput }));
      await streamResponse(
        "MESSAGE_STAGED. Current payload ready for deployment.\n\nType 'push' to send the data.",
        "info",
      );
      setStep("ready_to_push");
    } else if (step === "ready_to_push") {
      if (query === "push") {
        // Visual sequence
        setHistory((prev) => [
          ...prev,
          {
            type: "system",
            content: "❯ git add contact_payload.json",
            status: "info",
          },
        ]);
        await new Promise((r) => setTimeout(r, 600));
        setHistory((prev) => [
          ...prev,
          {
            type: "system",
            content: "❯ git commit -m 'Establish Handshake'",
            status: "info",
          },
        ]);
        await new Promise((r) => setTimeout(r, 800));
        setHistory((prev) => [
          ...prev,
          {
            type: "system",
            content: "❯ git push origin master",
            status: "info",
          },
        ]);

        try {
          const response = await fetch("https://formspree.io/f/mvzbnrvw", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: contactData.email,
              message: contactData.message,
              subject: "New Cyber_Hub Terminal Message",
            }),
          });

          if (!response.ok) throw new Error("Uplink Failure");

          await new Promise((r) => setTimeout(r, 1000));
          await streamResponse(
            "DEPLOYMENT_SUCCESS: Message transmitted to Himanshu. Origin secure.",
            "success",
          );

          setStep("idle");
          setContactData({ email: "", message: "" });
        } catch (error) {
          console.error("Formspree Error:", error);
          await streamResponse(
            "CRITICAL_ERROR: Signal lost during transmission. Type 'push' to retry or 'clear' to abort.",
            "error",
          );
        }
      } else {
        await streamResponse(
          "INVALID_ACTION. Type 'push' to transmit or 'clear' to reset.",
          "error",
        );
      }
    }

    setIsProcessing(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProcessing && input.trim()) {
      runCommand(input);
    }
  };

  return (
    <section
      id="contact"
      className="h-screen bg-[#050505] flex flex-col items-center justify-center p-4 md:p-10 relative overflow-hidden font-sans selection:bg-accent-blue/30 selection:text-white"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full text-center space-y-2 mb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-block px-3 py-1 rounded border border-accent-blue/20 bg-accent-blue/5 mb-2"
        >
          <span className="text-[10px] text-accent-blue font-bold tracking-[0.4em] uppercase">
            Protocol: Handshake
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
        >
          Cyber <span className="text-gradient">Hub.</span>
        </motion.h2>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 relative z-20 h-[75vh] max-h-[700px]">
        <div
          className="relative h-full bg-black/60 backdrop-blur-3xl rounded-2xl border border-white/5 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] group cursor-text"
          onClick={focusInput}
        >
          <motion.div
            animate={{ opacity: isProcessing ? [0.1, 0.4, 0.1] : 0.1 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 border border-accent-blue/50 rounded-2xl pointer-events-none z-30"
          />

          <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,.25)_50%),linear-gradient(90deg,rgba(255,0,0,.06),rgba(0,255,0,.02),rgba(0,0,255,.06))] bg-[length:100%_4px,3px_100%]" />

          <AnimatePresence>
            {isMatrix && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black pointer-events-none"
              >
                <canvas ref={canvasRef} className="w-full h-full opacity-60" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-12 border-b border-white/5 bg-white/5 flex items-center justify-between px-6 shrink-0 z-50">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <div className="h-4 w-px bg-white/10 ml-2" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <Globe className="w-3 h-3 text-accent-blue" /> Cyber_Hub //
                Neural_Handshake
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-zinc-600 font-black uppercase">
                  Encryption
                </span>
                <span className="text-[9px] text-accent-blue font-bold tracking-widest">
                  AES_256_ACTIVE
                </span>
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 text-sm space-y-4 scrollbar-hide relative z-10"
          >
            {history.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-4 leading-relaxed group/line",
                  item.type === "user" ? "text-white" : "text-zinc-500",
                )}
              >
                <span
                  className={cn(
                    "shrink-0 font-bold items-start pt-1",
                    item.type === "user" ? "text-accent-blue" : "text-zinc-800",
                  )}
                >
                  {item.type === "user" ? "❯" : "::"}
                </span>
                <div className="flex flex-col gap-2 flex-1">
                  <span
                    className={cn(
                      "whitespace-pre-wrap transition-colors",
                      item.status === "success"
                        ? "text-green-500/80"
                        : item.status === "error"
                          ? "text-red-500/80"
                          : item.type === "user"
                            ? "text-zinc-200"
                            : "text-zinc-400",
                    )}
                  >
                    {renderLinkifiedText(item.content)}
                    {item.isStreaming && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2.5 h-4.5 bg-accent-blue/80 ml-1 translate-y-1 shadow-[0_0_10px_rgba(0,112,243,0.4)]"
                      />
                    )}
                  </span>
                  {item.status === "success" && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-0.5 w-4 bg-green-500/20" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-4 text-accent-blue/50">
                <span className="shrink-0 font-bold text-[12px]">::</span>
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-[10px] font-bold tracking-[0.3em] uppercase"
                >
                  Searching...
                </motion.span>
              </div>
            )}

            {!isProcessing && (
              <div className="flex items-center gap-4 transition-opacity duration-300">
                <span className="text-accent-blue font-bold shrink-0">❯</span>
                <form
                  onSubmit={handleSubmit}
                  className="flex-1 relative flex items-center h-6"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setCursorPos(e.target.selectionStart || 0);
                    }}
                    onSelect={(e) => {
                      const target = e.target as HTMLInputElement;
                      setCursorPos(target.selectionStart || 0);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={isProcessing}
                    className="absolute inset-0 w-full bg-transparent border-none outline-none text-transparent p-0 caret-transparent font-mono"
                    autoComplete="off"
                  />
                  <div className="flex items-center pointer-events-none text-white whitespace-pre font-mono text-[14px]">
                    <span>{input.slice(0, cursorPos)}</span>
                    <motion.span
                      animate={
                        isFocused ? { opacity: [1, 0, 1] } : { opacity: 1 }
                      }
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className={cn(
                        "inline-block min-w-[8px] px-0 transition-all duration-200",
                        isFocused
                          ? "bg-accent-blue text-black shadow-[0_0_15px_rgba(0,112,243,0.8)]"
                          : "border border-accent-blue/50 text-white",
                      )}
                    >
                      {input[cursorPos] || "\u00A0"}
                    </motion.span>
                    <span>{input.slice(cursorPos + 1)}</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                Neural_Load
              </span>
              <Cpu className="w-3.5 h-3.5 text-accent-blue" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-zinc-400">Core_01</span>
                <span className="text-accent-blue">{systemStats.cpu}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${systemStats.cpu}%` }}
                  className="h-full bg-accent-blue shadow-[0_0_10px_rgba(0,112,243,0.5)]"
                />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                Signal_Str
              </span>
              <Signal className="w-3.5 h-3.5 text-accent-purple" />
            </div>
            <div className="flex gap-1.5 h-8 items-end">
              {[1, 0.8, 1.2, 0.9, 1.1, 0.7, 1.3].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [`${h * 40}%`, `${h * 80}%`, `${h * 40}%`],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="flex-1 bg-accent-purple/30 rounded-t-sm"
                />
              ))}
            </div>
            <div className="text-[10px] text-center text-zinc-600 font-mono italic">
              Origin Status: {systemStats.signal === 100 ? "OPTIMAL" : "STABLE"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center gap-2 group hover:border-accent-blue/30 transition-colors cursor-pointer">
              <Shield className="w-4 h-4 text-zinc-600 group-hover:text-accent-blue" />
              <span className="text-[9px] text-zinc-700 group-hover:text-zinc-400 font-black uppercase">
                SECURE
              </span>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center gap-2 group hover:border-accent-purple/30 transition-colors cursor-pointer">
              <Zap className="w-4 h-4 text-zinc-600 group-hover:text-accent-purple" />
              <span className="text-[9px] text-zinc-700 group-hover:text-zinc-400 font-black uppercase">
                FAST
              </span>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center gap-2 group hover:border-green-500/30 transition-colors cursor-pointer">
              <Activity className="w-4 h-4 text-zinc-600 group-hover:text-green-500" />
              <span className="text-[9px] text-zinc-700 group-hover:text-zinc-400 font-black uppercase">
                LIVE
              </span>
            </div>
            <div className="bg-accent-blue/5 border border-accent-blue/20 p-4 rounded-xl flex flex-col items-center justify-center gap-2">
              <span className="text-[8px] text-accent-blue font-black uppercase">
                V4.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
