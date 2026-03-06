"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Monitor, Palette } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { galleryProjects } from "@/components/gallery/data";

export default function Gallery() {
  const [mode, setMode] = useState<"design" | "code">("design");
  const artifactsReturnHref = encodeURIComponent(
    `/?resume=artifacts&mode=${mode}`,
  );

  const filteredProjects = galleryProjects.filter((p) => p.category === mode);
  const projectCount = filteredProjects.length;
  const gridClass =
    projectCount <= 1
      ? "grid-cols-1"
      : projectCount === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2";

  return (
    <section className="pt-0 pb-10 px-4 md:px-10 max-w-7xl mx-auto space-y-10 text-white">
      {/* mode toggle */}
      <div className="flex justify-center">
        <div className="relative grid grid-cols-2 rounded-full border border-white/5 bg-[#111111] p-1">
          <motion.div
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white"
            animate={{ x: mode === "design" ? "0%" : "100%" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
          <button
            onClick={() => {
              setMode("design");
            }}
            className={cn(
              "relative z-10 flex w-[120px] items-center justify-center gap-1.5 rounded-full px-5 py-1.5 text-xs font-bold transition-colors",
              mode === "design"
                ? "text-black"
                : "text-zinc-500 hover:text-white",
            )}
          >
            <Palette className="h-3.5 w-3.5" /> Design
          </button>
          <button
            onClick={() => {
              setMode("code");
            }}
            className={cn(
              "relative z-10 flex w-[120px] items-center justify-center gap-1.5 rounded-full px-5 py-1.5 text-xs font-bold transition-colors",
              mode === "code" ? "text-black" : "text-zinc-500 hover:text-white",
            )}
          >
            <Monitor className="h-3.5 w-3.5" /> Code
          </button>
        </div>
      </div>

      {/* grid rendering */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn("grid gap-6", gridClass)}
        >
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className={cn(
                "glass rounded-2xl group relative overflow-hidden flex flex-col p-6 space-y-4 hover:border-white/20 transition-colors",
                projectCount === 3 && idx === 0 ? "md:row-span-2" : "",
                "min-h-[300px]",
              )}
            >
              {/* card meta */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
                    00{project.id} / {project.category}
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-gradient transition-all">
                    {project.title}
                  </h3>
                </div>
                {project.stats && (
                  <span className="px-2 py-0.5 bg-accent-blue/20 text-accent-blue text-[10px] font-bold rounded-full border border-accent-blue/30">
                    {project.stats}
                  </span>
                )}
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                {project.description}
              </p>

              {/* tech stack */}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded text-zinc-500"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* action buttons */}
              <div className="pt-4 flex gap-4">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold text-white hover:text-accent-blue transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" /> View Project
                </a>

                {mode === "code" && project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <Github className="w-3 h-3" /> Source
                  </a>
                )}
              </div>

              {/* hover beam effect */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue via-transparent to-accent-purple" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* view more button */}
      <div className="flex justify-center pt-12">
        <Link
          href={`/artifacts?mode=${mode}&return=${artifactsReturnHref}`}
          className="group relative px-10 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden hover:border-accent-blue/50 transition-all duration-500 hover:scale-105"
        >
          <div className="absolute inset-0 bg-accent-blue/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <span className="relative z-10 text-[10px] font-black tracking-[0.4em] uppercase group-hover:text-accent-blue transition-colors">
            View More Projects // Archive
          </span>
        </Link>
      </div>
    </section>
  );
}
