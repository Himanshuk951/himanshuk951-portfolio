"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

const principles = [
  "Design and code are one system, not two separate jobs.",
  "Motion should guide attention, not distract from content.",
  "Fast, clear, and maintainable UI beats visual noise every time.",
];

const timeline = [
  {
    year: "2026",
    role: "Creative Developer",
    note: "Exploring interactive web experiences and combining design with development.",
  },
  {
    year: "2025",
    role: "Frontend Developer",
    note: "Building responsive interfaces and learning reusable component-based architecture.",
  },
  {
    year: "2024",
    role: "UI/UX Designer",
    note: "Learning product design, visual systems, and creating high-fidelity prototypes in Figma.",
  },
];

export default function AboutPage() {
  const router = useRouter();
  const [returnHref, setReturnHref] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReturnHref(params.get("return") || "/");
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-accent-blue/30">
      <div className="pointer-events-none absolute inset-0 grid-background opacity-50" />
      <div className="pointer-events-none absolute -left-24 top-20 h-[420px] w-[420px] rounded-full bg-accent-blue/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-[360px] w-[360px] rounded-full bg-accent-purple/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-10 md:px-8 md:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <button
            type="button"
            onClick={() => router.push(returnHref)}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </motion.div>

        <section className="mt-10 grid items-end gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="space-y-6"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-accent-blue">
              About
            </p>
            <h1 className="text-5xl font-black uppercase leading-[0.88] tracking-tight md:text-7xl">
              Himanshu
              <br />
              <span className="text-zinc-400">Designer + Developer</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              I build digital products where visual craft and frontend
              engineering move together. My focus is creating interfaces that
              feel intentional, perform fast, and scale cleanly.
            </p>
            <div className="flex flex-wrap gap-5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
              <span>UI/UX</span>
              <span>Frontend</span>
              <span>Motion Systems</span>
              <span>Design Systems</span>
              <span>Product Thinking</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="justify-self-start md:justify-self-end"
          >
            <div className="relative aspect-[3/4] w-[260px] overflow-hidden rounded-[26px] border border-white/10 md:w-[300px]">
              <Image
                src="/Himanshu.jpg"
                alt="Himanshu portrait"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-16 border-t border-white/10 pt-10"
        >
          <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
            Principles
          </h2>
          <div className="mt-6 space-y-5">
            {principles.map((item, idx) => (
              <p
                key={item}
                className="text-2xl font-semibold leading-tight text-zinc-200 md:text-3xl"
              >
                <span className="mr-3 text-accent-blue/80">0{idx + 1}.</span>
                {item}
              </p>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-16 border-t border-white/10 pt-10"
        >
          <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
            Timeline
          </h2>
          <div className="mt-7 space-y-6">
            {timeline.map((item) => (
              <div
                key={item.year}
                className="grid gap-2 md:grid-cols-[110px_1fr]"
              >
                <p className="text-lg font-black text-accent-blue">
                  {item.year}
                </p>
                <div>
                  <p className="text-xl font-bold text-zinc-100">{item.role}</p>
                  <p className="mt-1 text-zinc-400">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-16 border-t border-white/10 pt-10"
        >
          <a
            href="mailto:hello@example.com"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-white"
          >
            Let&apos;s Build Something Strong
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </div>
    </main>
  );
}
