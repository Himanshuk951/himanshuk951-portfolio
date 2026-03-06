"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { heroBackgroundText, wipeVariants } from "@/components/hero/constants";

type HeroProps = {
  onEnter: (side: "design" | "code") => void;
};

export default function Hero({ onEnter }: HeroProps) {
  const [hoveredSide, setHoveredSide] = useState<"design" | "code" | null>(
    null,
  );
  const [selectedSide, setSelectedSide] = useState<"design" | "code" | null>(
    null,
  );

  // mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // parallax transforms for the reveal card - Unified into clear x/y/rotate
  const rotateX = useTransform(springY, [-500, 500], [20, -20]);
  const rotateY = useTransform(springX, [-500, 500], [-20, 20]);
  const moveX = useTransform(springX, [-500, 500], [-40, 40]);
  const moveY = useTransform(springY, [-500, 500], [-40, 40]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // map mouse to center of screen [-0.5, 0.5] range * 1000 for transforms
      const x = (clientX / innerWidth - 0.5) * 1000;
      const y = (clientY / innerHeight - 0.5) * 1000;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const [wipeDirection, setWipeDirection] = useState<"left" | "right">("left");

  const handleSelect = (side: "design" | "code") => {
    setWipeDirection(side === "design" ? "left" : "right");
    setSelectedSide(side);
    // clear hover to prevent ghost cards during transition
    setHoveredSide(null);
    setTimeout(() => onEnter(side), 1000);
  };

  return (
    <div
      className="relative h-screen w-full flex overflow-hidden bg-[#050505] selection:bg-accent-blue/30 selection:text-white"
      style={{ perspective: "1500px" }}
    >
      {/* background text reveal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{
            opacity: hoveredSide ? 0.08 : 0.03,
            scale: hoveredSide ? 1.05 : 1,
          }}
          transition={{ duration: 1.5 }}
          className="text-[25vw] font-black uppercase tracking-tighter leading-none text-white select-none whitespace-nowrap"
        >
          {hoveredSide === "design"
            ? heroBackgroundText.design
            : hoveredSide === "code"
              ? heroBackgroundText.code
              : heroBackgroundText.idle}
        </motion.h1>
      </div>

      {/* designer side (UI/UX) */}
      <motion.div
        className={cn(
          "relative h-full flex flex-col items-center justify-center cursor-pointer group transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          selectedSide === "code"
            ? "w-0"
            : selectedSide === "design"
              ? "w-full"
              : hoveredSide === "design"
                ? "w-[55%]"
                : hoveredSide === "code"
                  ? "w-[45%]"
                  : "w-1/2",
        )}
        onMouseEnter={() => {
          if (!selectedSide) {
            setHoveredSide("design");
          }
        }}
        onMouseLeave={() => !selectedSide && setHoveredSide(null)}
        onClick={() => !selectedSide && handleSelect("design")}
      >
        <div className="z-30 text-center space-y-6 px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full border border-accent-blue/30 bg-accent-blue/5 backdrop-blur-sm"
          >
            <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-accent-blue font-bold">
              Concept & Logic
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.8] text-white">
            UI/UX
            <br />
            <span className="group-hover:text-accent-blue transition-colors duration-500">
              Designer
            </span>
          </h2>

          <div className="flex justify-center pt-8">
            <motion.div
              animate={{
                width: hoveredSide === "design" ? 60 : 0,
                opacity: hoveredSide === "design" ? 1 : 0,
              }}
              className="h-1 bg-accent-blue rounded-full"
            />
          </div>
        </div>

        {/* hover reveal card (parallax) */}
        <AnimatePresence>
          {hoveredSide === "design" && !selectedSide && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              style={{
                rotateX,
                rotateY,
                x: moveX,
                y: moveY,
                transformStyle: "preserve-3d",
              }}
              className="absolute right-[-5%] top-[25%] w-[320px] h-[400px] pointer-events-none hidden lg:block z-20"
            >
              <div className="w-full h-full rounded-2xl glass border-accent-blue/20 overflow-hidden p-6 text-center ring-1 ring-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                <div
                  className="space-y-4"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <div className="w-16 h-16 bg-accent-blue/20 rounded-full mx-auto flex items-center justify-center mb-4 ring-1 ring-accent-blue/50">
                    <div className="w-3 h-3 bg-accent-blue rounded-full animate-ping" />
                  </div>
                  <p className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">
                    System Check
                  </p>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-white">
                    Visual Intelligence
                  </h3>
                  <p className="text-zinc-600 text-[10px]">
                    Architecting high-fidelity components with pixel-perfect
                    precision.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* engineer side (fullstack) */}
      <motion.div
        className={cn(
          "relative h-full flex flex-col items-center justify-center cursor-pointer group transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-[#080808]",
          selectedSide === "design"
            ? "w-0"
            : selectedSide === "code"
              ? "w-full"
              : hoveredSide === "code"
                ? "w-[55%]"
                : hoveredSide === "design"
                  ? "w-[45%]"
                  : "w-1/2",
        )}
        onMouseEnter={() => {
          if (!selectedSide) {
            setHoveredSide("code");
          }
        }}
        onMouseLeave={() => !selectedSide && setHoveredSide(null)}
        onClick={() => !selectedSide && handleSelect("code")}
      >
        <div className="z-30 text-center space-y-6 px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full border border-accent-purple/30 bg-accent-purple/5 backdrop-blur-sm"
          >
            <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-accent-purple font-bold">
              Architecture & Speed
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.8] text-white">
            Fullstack
            <br />
            <span className="group-hover:text-accent-purple transition-colors duration-500">
              Developer
            </span>
          </h2>

          <div className="flex justify-center pt-8">
            <motion.div
              animate={{
                width: hoveredSide === "code" ? 60 : 0,
                opacity: hoveredSide === "code" ? 1 : 0,
              }}
              className="h-1 bg-accent-purple rounded-full"
            />
          </div>
        </div>

        {/* hover reveal card (parallax) */}
        <AnimatePresence>
          {hoveredSide === "code" && !selectedSide && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              style={{
                rotateX,
                rotateY,
                x: moveX,
                y: moveY,
                transformStyle: "preserve-3d",
              }}
              className="absolute left-[-5%] top-[35%] w-[320px] h-[440px] pointer-events-none hidden lg:block z-20"
            >
              <div className="w-full h-full rounded-3xl bg-[#0a0a0a] border border-accent-purple/20 overflow-hidden p-8 ring-1 ring-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                <div
                  className="h-full flex flex-col justify-between border-l border-white/5 pl-4"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <div className="space-y-4">
                    <div className="flex gap-2 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(121,40,202,0.8)]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                    </div>
                    <p className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase mb-1">
                      Protocol: Build
                    </p>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-tight">
                      Performant Architect
                    </h3>
                    <p className="text-zinc-500 text-[10px] leading-relaxed">
                      Scaling logic with architectural discipline and
                      engineering empathy.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent-purple to-transparent"
                      />
                    </div>
                    <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
                      Optimizing Origin...
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* wipe transition overlay */}
      <motion.div
        key={selectedSide ? `wipe-${selectedSide}` : "wipe-idle"}
        custom={wipeDirection}
        variants={wipeVariants}
        initial="initial"
        animate={selectedSide ? "animate" : "initial"}
        transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
        className="absolute inset-0 z-[100] bg-white pointer-events-none"
      />
    </div>
  );
}
