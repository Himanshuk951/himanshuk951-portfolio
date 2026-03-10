"use client";

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Gallery from "@/components/Gallery";
import TerminalContact from "@/components/TerminalContact";

import StatusBar from "@/components/StatusBar";

function HomeContent() {
  const defaultTitle = "Himanshu Portfolio";
  const defaultFavicon = "/favicon.svg";
  const hiddenFavicon = "/favicon-sad.svg";
  const searchParams = useSearchParams();
  const resumeTarget = searchParams.get("resume");
  const resumeAbout = resumeTarget === "about";
  const resumeArtifacts = resumeTarget === "artifacts";
  const hasResume = resumeAbout || resumeArtifacts;
  const resumeModeParam = searchParams.get("mode");
  const resumeMode: "design" | "code" =
    resumeModeParam === "code" ? "code" : "design";

  const [phase, setPhase] = useState<"hero" | "content">(
    hasResume ? "content" : "hero",
  );
  const [targetSection, setTargetSection] = useState<string | null>(
    resumeAbout ? "about" : resumeArtifacts ? "artifacts" : null,
  );
  const [activeMode, setActiveMode] = useState<"design" | "code">(resumeMode);
  const [currentBranch, setCurrentBranch] = useState(
    resumeAbout ? "identity" : resumeArtifacts ? "artifacts" : "main",
  );
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  useEffect(() => {
    if (!hasResume || typeof window === "undefined") return;
    window.history.replaceState({}, "", "/");
  }, [hasResume]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.title = defaultTitle;
    const setFavicon = (href: string) => {
      const faviconLinks = document.querySelectorAll(
        'link[rel~="icon"]',
      ) as NodeListOf<HTMLLinkElement>;
      faviconLinks.forEach((link) => {
        link.href = href;
      });
    };
    setFavicon(defaultFavicon);

    const handleVisibilityChange = () => {
      const isHidden = document.hidden;
      document.title = isHidden ? "Come Back" : defaultTitle;
      setFavicon(isHidden ? hiddenFavicon : defaultFavicon);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = defaultTitle;
      setFavicon(defaultFavicon);
    };
  }, []);

  const handleEnter = (side: "design" | "code") => {
    setActiveMode(side);
    // User requested: Design -> Bottom (Contact), Code -> Top (About)
    setTargetSection(side === "design" ? "contact" : "about");
    setPhase("content");
    setIsAtBottom(false);
    setHasUserScrolled(false);
    setCurrentBranch(side === "design" ? "neural" : "identity");
  };

  useEffect(() => {
    if (phase === "content" && targetSection) {
      const timer = setTimeout(() => {
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500); // Wait for AnimatePresence transition
      return () => clearTimeout(timer);
    }
  }, [phase, targetSection]);

  // Track section + bottom state only in content mode
  useEffect(() => {
    if (phase !== "content") return;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const nearBottom = scrollPos + windowHeight >= docHeight - 12;

      setIsAtBottom(nearBottom);

      if (scrollPos < windowHeight * 0.8) {
        setCurrentBranch("identity");
      } else if (scrollPos < windowHeight * 1.8) {
        setCurrentBranch("artifacts");
      } else {
        setCurrentBranch("neural");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "content") return;

    const markUserScrolled = () => setHasUserScrolled(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "PageDown" ||
        e.key === "PageUp" ||
        e.key === "Home" ||
        e.key === "End" ||
        e.key === " "
      ) {
        setHasUserScrolled(true);
      }
    };

    window.addEventListener("wheel", markUserScrolled, { passive: true });
    window.addEventListener("touchmove", markUserScrolled, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", markUserScrolled);
      window.removeEventListener("touchmove", markUserScrolled);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [phase]);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden selection:bg-accent-blue/30 selection:text-white relative">
      {/* Background Texture Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-background opacity-100" />

      <AnimatePresence mode="wait">
        {phase === "hero" ? (
          <motion.div
            key="hero-phase"
            className="relative z-10"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Hero onEnter={handleEnter} />
          </motion.div>
        ) : (
          <motion.div
            key="content-phase"
            initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: 0.9,
              filter: "blur(20px)",
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="space-y-0 relative z-10"
          >
            {/* Phase 2: About Me (Cursor IDE Aesthetic) */}
            <AboutMe
              onBack={() => {
                setPhase("hero");
                setCurrentBranch("main");
                setIsAtBottom(false);
              }}
              mode={activeMode}
            />

            {/* Phase 3: Work Galleries */}
            <div
              id="artifacts"
              className="bg-[#050505] border-y border-white/5 py-12 relative z-10"
            >
              <div className="max-w-7xl mx-auto px-4 mb-8 text-center space-y-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
                >
                  Selected <span className="text-gradient">Artifacts.</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-zinc-500 font-mono text-xs uppercase tracking-widest"
                >
                  Design Mode // Coder Mode
                </motion.p>
              </div>
              <Gallery />
            </div>

            {/* Phase 4: Terminal Contact Hub */}
            <TerminalContact
              onBack={() => {
                setPhase("hero");
                setCurrentBranch("main");
                setIsAtBottom(false);
              }}
              mode={activeMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <StatusBar
        activeSection={currentBranch}
        variant={
          phase === "content" && hasUserScrolled && isAtBottom
            ? "bottom"
            : "github"
        }
      />

      {/* Persistent Static Grain */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
