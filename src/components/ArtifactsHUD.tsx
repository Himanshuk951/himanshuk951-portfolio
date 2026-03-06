"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  artifactProjects,
  EMPTY_PROJECT_MESSAGE,
} from "@/components/artifacts-hud/data";

export default function ArtifactsGallery() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const returnHref = searchParams.get("return") || "/";
  const hasReturnHref = searchParams.has("return");
  const [mode, setMode] = useState<"design" | "code">(
    modeParam === "code" ? "code" : "design",
  );
  const filteredProjects = artifactProjects.filter(
    (project) => project.type === mode,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex =
    filteredProjects.length > 0
      ? Math.min(activeIndex, filteredProjects.length - 1)
      : 0;
  const activeProject = filteredProjects[safeActiveIndex] ?? null;

  return (
    <motion.main
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-accent-blue/30"
    >
      <div className="pointer-events-none absolute inset-0 grid-background opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(0,112,243,0.14),transparent_40%),radial-gradient(circle_at_85%_75%,rgba(121,40,202,0.12),transparent_42%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 h-screen w-full border-y border-white/10 bg-black/40 backdrop-blur-xl"
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-6 md:px-10">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Artifacts
          </h1>
          <div className="flex items-center gap-5">
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500 md:block">
              Work Index
            </p>
            <div className="relative flex rounded-full border border-white/15 bg-black/40 p-1">
              <motion.div
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-white"
                animate={{ x: mode === "design" ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
              />
              <button
                type="button"
                onClick={() => {
                  setMode("design");
                  setActiveIndex(0);
                }}
                className={`relative z-10 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
                  mode === "design"
                    ? "text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                UI/UX
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("code");
                  setActiveIndex(0);
                }}
                className={`relative z-10 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
                  mode === "code"
                    ? "text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Coding
              </button>
            </div>
          </div>
        </div>

        <div className="relative grid h-[calc(100vh-72px)] gap-6 px-4 py-6 md:grid-cols-[1.08fr_1fr] md:items-center md:px-10 md:py-8">
          <motion.div
            className="pointer-events-none absolute -left-10 top-4 h-40 w-40 rounded-full bg-accent-blue/25 blur-3xl"
            animate={{ y: safeActiveIndex * 88 }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
          />

          <div className="relative z-10">
            <p className="mb-4 text-3xl font-semibold tracking-tight text-zinc-300 md:text-5xl">
              {mode === "design" ? "Latest UI/UX Work" : "Latest Coding Work"}
            </p>
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto border-b border-white/10 pr-1 scrollbar-hide">
              {filteredProjects.length === 0 && (
                <div className="border-t border-white/10 px-2 py-6 text-sm text-zinc-500">
                  {EMPTY_PROJECT_MESSAGE}
                </div>
              )}
              {filteredProjects.map((project, index) => {
                const isActive = index === safeActiveIndex;

                return (
                  <motion.a
                    key={project.id}
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => {
                      setActiveIndex(index);
                    }}
                    onFocus={() => {
                      setActiveIndex(index);
                    }}
                    className="relative flex min-h-20 items-center border-t border-white/10 px-2 py-4 md:min-h-24 md:px-1"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="artifact-active-row"
                        className="absolute inset-0 bg-white/5"
                        transition={{
                          type: "spring",
                          stiffness: 240,
                          damping: 26,
                        }}
                      />
                    )}
                    <span className="relative flex items-baseline gap-4">
                      <span
                        className={`text-4xl font-black leading-none tracking-tight md:text-6xl ${
                          isActive ? "text-white" : "text-zinc-600"
                        }`}
                      >
                        {project.title}
                      </span>
                      <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 md:block">
                        {project.year}
                      </span>
                    </span>
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-black md:h-[70vh]">
            {activeProject ? (
              <AnimatePresence mode="wait">
                <motion.a
                  key={activeProject.id}
                  href={activeProject.link}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 block"
                  initial={{ opacity: 0, x: 24, scale: 1.02 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -24, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${activeProject.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
                  <div className="absolute inset-0 bg-accent-blue/15 mix-blend-overlay" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white md:p-7">
                    <div className="max-w-[75%]">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-accent-blue">
                        {activeProject.id} {"-"} Artifact
                      </p>
                      <h2 className="text-3xl font-black leading-none tracking-tight md:text-5xl">
                        {activeProject.title}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-300 md:text-base">
                        {activeProject.tagline}
                      </p>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/30 md:h-12 md:w-12">
                      <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />
                    </span>
                  </div>
                </motion.a>
              </AnimatePresence>
            ) : (
              <div className="grid h-full place-items-center text-sm text-zinc-500">
                {EMPTY_PROJECT_MESSAGE}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2">
        <button
          type="button"
          onClick={() => {
            if (hasReturnHref) {
              router.push(returnHref);
              return;
            }
            if (window.history.length > 1) {
              router.back();
              return;
            }
            router.push("/");
          }}
          className="group flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-200 backdrop-blur-md hover:border-accent-blue/40 hover:text-white"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
      </div>
    </motion.main>
  );
}

