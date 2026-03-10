"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  ChevronDown,
  MessageSquare,
  Search,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getInitialAboutHistory,
  timelineData,
  type AboutHistoryItem as HistoryItem,
} from "@/components/about-me/constants";

import { TERMINAL_KNOWLEDGE_BASE, type TerminalMode } from "@/lib/knowledge";
import {
  SOCIAL_COMMAND_ALIASES,
  SOCIAL_MEDIA_LINKS,
  SOCIAL_MEDIA_LIST,
} from "@/lib/social";

export default function AboutMe({
  onBack,
  mode = "design",
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
    getInitialAboutHistory(mode),
  );
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFile, setActiveFile] = useState("About me");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  } as const;

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
    options?: { image?: string; ctaLabel?: string; ctaHref?: string },
  ) => {
    setHistory((prev) => [
      ...prev,
      {
        type: "system",
        content: "",
        isStreaming: true,
        image: options?.image,
        ctaLabel: options?.ctaLabel,
        ctaHref: options?.ctaHref,
      },
    ]);

    for (let i = 0; i < text.length; i++) {
      const currentText = text.slice(0, i + 1);
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].content = currentText;
        return newHistory;
      });
      await new Promise((resolve) => setTimeout(resolve, 15));
    }

    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1].isStreaming = false;
      return newHistory;
    });
  };

  const handleCommand = async (cmd: string) => {
    const query = cmd.trim().toLowerCase();
    if (!query) return;

    setHistory((prev) => [...prev, { type: "user", content: cmd }]);
    setInput("");
    setCursorPos(0);
    setIsProcessing(true);

    await new Promise((r) => setTimeout(r, 500));

    if (query === "about me" || query === "cat about_me.sh") {
      const bioText = `The Overview:\n"I am a hybrid creator. I don't believe in the wall between Design and Engineering. To me, they are the same process: Problem Solving."\n\nAs a Designer: I focus on 'The Feel.' I build design systems that aren't just pretty, but functional, accessible, and emotionally resonant.\n\nAs a Developer: I focus on 'The Flow.' I write type-safe, performant code that ensures the design isn't just a static picture, but a living, breathing product.\n\nCurrent Focus: Building high-end interfaces where motion design meets scalable architecture.`;
      // high-contrast BW placeholder portrait
      await streamResponse(bioText, {
        image: "/Himanshu.jpg",
        ctaLabel: "Know more about me",
        ctaHref: `/about?return=${encodeURIComponent(`/?resume=about&mode=${mode}`)}`,
      });
    } else if (TERMINAL_KNOWLEDGE_BASE[query]) {
      const response = TERMINAL_KNOWLEDGE_BASE[query][mode];
      await streamResponse(response);
    } else if (
      query === "socialmedia" ||
      query === "social media" ||
      query === "social" ||
      query === "socal media"
    ) {
      await streamResponse(`SOCIAL_MEDIA_LINKS:\n${SOCIAL_MEDIA_LIST}`, {
        image: "/social-media.svg",
      });
    } else if (query in SOCIAL_COMMAND_ALIASES) {
      const platform =
        SOCIAL_COMMAND_ALIASES[query as keyof typeof SOCIAL_COMMAND_ALIASES];
      await streamResponse(
        `${platform.toUpperCase()} :: ${SOCIAL_MEDIA_LINKS[platform]}`,
        { image: `/social-${platform}.svg` },
      );
    } else if (query === "help") {
      const knowledgeCommands = Object.keys(TERMINAL_KNOWLEDGE_BASE).join(", ");
      await streamResponse(
        `AVAILABLE PROTOCOLS:\n- skills :: fetch technical stack\n- socialmedia / social media / social :: list all social links\n- instagram | linkedin | x | github | gethub :: get one social link\n- contact :: initialize handshake\n- cat [file] :: read filesystem entry\n- back :: return to origin\n- clear :: purge buffer\n\nKNOWLEDGE_BASE QUERY:\n[ ${knowledgeCommands} ]`,
      );
    } else if (query === "skills") {
      await streamResponse(
        "Fetching tech stack... [React, Next.js, TypeScript, Figma, Tailwind].",
      );
    } else if (query === "contact") {
      await streamResponse(
        "Initializing secure connection... Please enter your message below.",
      );
    } else if (query === "back") {
      await streamResponse("ORIGIN_PROTOCOL_SYNCING... [DONE]");
      await streamResponse(
        "SHUTTING DOWN IDENTITY_PROTOCOL... UNWRAPPING DOM.",
      );
      await new Promise((r) => setTimeout(r, 800));
      onBack?.();
    } else if (query.startsWith("cat ")) {
      const fileName = query.replace("cat ", "");
      await streamResponse(
        `READING_FILE: ${fileName}... \n\nIdentity record recovered for ${fileName.split("_")[0]}. Verification: Success.`,
      );
    } else if (query === "clear") {
      setHistory([
        {
          type: "system",
          content: `BUFFER PURGED. MODE: ${mode.toUpperCase()}. READY.`,
        },
      ]);
    } else {
      await streamResponse(`[ERROR]: Command not found. Try "help".`);
    }

    setIsProcessing(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProcessing && input.trim()) {
      handleCommand(input);
    }
  };

  return (
    <section
      id="about"
      className="h-screen bg-[#050505] flex items-center justify-center p-4 md:p-10 font-sans selection:bg-accent-blue/30 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div
        onClick={focusInput}
        className="max-w-7xl w-full h-[85vh] max-h-[800px] bg-black/60 backdrop-blur-3xl rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col relative z-20 group cursor-text"
      >
        <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,.25)_50%),linear-gradient(90deg,rgba(255,0,0,.06),rgba(0,255,0,.02),rgba(0,0,255,.06))] bg-[length:100%_4px,3px_100%]" />
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border border-accent-blue/20 rounded-2xl pointer-events-none z-30"
        />

        <div className="h-12 border-b border-white/5 bg-white/5 flex items-center justify-between px-6 shrink-0 z-50">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
            <div className="h-4 w-px bg-white/10 ml-2" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <Globe className="w-3 h-3 text-accent-blue" />
              {"Identity_Terminal // Bio_Engine"}
            </span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r border-white/5 bg-black/40 hidden md:flex flex-col">
            <div className="p-4 flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              <span>Filesystem</span>
              <Search className="w-3 h-3" />
            </div>

            <div className="px-2 space-y-1">
              <div className="flex items-center gap-2 p-1 hover:bg-white/5 rounded cursor-pointer text-zinc-300">
                <ChevronDown className="w-4 h-4 text-accent-blue" />
                <span className="text-[10px] font-bold uppercase text-zinc-400">
                  ~/Root/Timeline
                </span>
              </div>
              <div className="pl-4 space-y-1 relative">
                {/* vertical connector line */}
                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/5 z-0" />

                {timelineData.map((item) => {
                  const fileName =
                    item.year === "About"
                      ? "About me"
                      : `${item.year}_${item.role.split(" ")[0]}.sh`;
                  const isActive = activeFile === fileName;

                  return (
                    <div
                      key={item.year}
                      onClick={() => {
                        setActiveFile(fileName);
                        handleCommand(
                          item.year === "About"
                            ? "About me"
                            : `cat ${fileName}`,
                        );
                      }}
                      className={cn(
                        "flex items-center gap-2 p-1.5 px-3 rounded text-[10px] cursor-pointer transition-all duration-300 uppercase tracking-tight relative z-10",
                        isActive
                          ? "text-zinc-100 bg-accent-blue/10 font-bold border-l border-accent-blue shadow-[0_0_15px_rgba(0,112,243,0.1)]"
                          : "text-zinc-600 hover:bg-white/5 hover:text-zinc-300 border-l border-transparent",
                      )}
                    >
                      <FileText
                        className={cn(
                          "w-3 h-3 transition-colors",
                          isActive ? "text-accent-blue" : "text-inherit",
                        )}
                      />
                      <span>{fileName}</span>

                      {isActive && (
                        <motion.div
                          layoutId="active-marker"
                          className="absolute -left-1.5 w-1 h-3 bg-accent-blue shadow-[0_0_10px_#0070f3]"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row divide-x divide-white/5 relative z-10">
            <div className="flex-1 flex flex-col bg-black/20">
              <div className="h-10 border-b border-white/5 flex items-center px-6 gap-2 bg-white/5 font-mono">
                <MessageSquare className="w-3.5 h-3.5 text-accent-blue" />
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  Bio_Terminal // Stdout
                </span>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 md:p-10 space-y-4 scrollbar-hide font-mono"
              >
                <AnimatePresence mode="popLayout">
                  {history.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={springTransition}
                      className={cn(
                        "flex gap-4 leading-relaxed group/line",
                        msg.type === "user" ? "text-white" : "text-zinc-500",
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 font-bold pt-1 text-[12px]",
                          msg.type === "user"
                            ? "text-accent-blue"
                            : "text-zinc-800",
                        )}
                      >
                        {msg.type === "user" ? "❯" : "::"}
                      </span>
                      <div
                        className={cn(
                          "flex-1 flex gap-6",
                          msg.image
                            ? "flex-col md:flex-row items-start"
                            : "flex-col",
                        )}
                      >
                        {msg.image && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={springTransition}
                            className={cn(
                              "relative shrink-0 overflow-hidden",
                              msg.image.startsWith("/social-")
                                ? "w-14 h-14 rounded-md border border-white/10 bg-white/5"
                                : "w-full md:w-48 aspect-[3/4] md:aspect-[2/3] rounded-lg border border-white/10 shadow-2xl",
                            )}
                          >
                            <Image
                              src={msg.image}
                              alt="Creator"
                              fill
                              className={cn(
                                msg.image.startsWith("/social-")
                                  ? "object-contain p-2 grayscale-0 brightness-100"
                                  : "object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700",
                              )}
                            />
                            {!msg.image.startsWith("/social-") && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            )}
                          </motion.div>
                        )}
                        <div className="flex-1">
                          <p
                            className={cn(
                              "whitespace-pre-wrap text-[13px] md:text-[14px] leading-relaxed",
                              msg.type === "user"
                                ? "text-zinc-200"
                                : "text-zinc-400",
                            )}
                          >
                            {renderLinkifiedText(msg.content)}
                            {msg.isStreaming && (
                              <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-2.5 h-4.5 bg-accent-blue/80 ml-1 translate-y-1 shadow-[0_0_10px_rgba(0,112,243,0.4)]"
                              />
                            )}
                          </p>
                          {msg.ctaHref && msg.ctaLabel && !msg.isStreaming && (
                            <Link
                              href={msg.ctaHref}
                              className="mt-4 inline-flex items-center rounded-full border border-accent-blue/40 bg-accent-blue/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-blue hover:border-accent-blue/70 hover:bg-accent-blue/20"
                            >
                              {msg.ctaLabel}
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isProcessing && (
                  <div className="flex items-center gap-4 text-accent-blue/50">
                    <span className="shrink-0 font-bold text-[12px]">::</span>
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-[10px] font-bold tracking-[0.3em] uppercase"
                    >
                      Computing_Logic...
                    </motion.span>
                  </div>
                )}

                {!isProcessing && (
                  <div className="flex items-center gap-4">
                    <span className="text-accent-blue font-bold shrink-0 text-[12px]">
                      ❯
                    </span>
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

              <div className="h-8 border-t border-white/5 bg-black/40 flex items-center px-6 justify-between">
                <span className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">
                  Protocol: Bio_Query_v4
                </span>
                <span className="text-[8px] text-zinc-800 font-bold uppercase tracking-widest">
                  Status: Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
