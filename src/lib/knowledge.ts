export type TerminalMode = "design" | "code";

export const TERMINAL_KNOWLEDGE_BASE: Record<
  string,
  { design: string; code: string }
> = {
  whois: {
    design:
      "I'm a digital architect obsessed with how things feel. I turn friction into flow.",
    code: "I'm a full-stack engineer optimized for low latency, clean state, and scalable systems.",
  },
  stack: {
    design:
      "Figma, Adobe Suite, Framer, and a deep understanding of Color Psychology.",
    code: "Next.js 15, TypeScript, Tailwind, Node.js, and a lot of caffeine.",
  },
  why: {
    design:
      "Because beautiful design builds trust before a user even clicks a button.",
    code: "Because if the architecture is garbage, the prettiest UI won't save the product.",
  },
  hi: {
    design: "Welcome to the gallery! Looking for inspiration or a partnership?",
    code: "Initial handshake successful. Accessing local repositories...",
  },
  hello: {
    design: "Welcome to the gallery! Looking for inspiration or a partnership?",
    code: "Initial handshake successful. Accessing local repositories...",
  },
  status: {
    design: "Status: Creating. Mood: High-fidelity. Ready to design.",
    code: "Status: Compiled. Tests: Passing. Ready to build.",
  },
  secret: {
    design: "The secret to design? It's the pixels you don't see.",
    code: "The secret to code? It's the technical debt you actually fix.",
  },
  design: {
    design: "You're already here. Enjoy the aesthetics.",
    code: "[SYSTEM]: Aborting dev_mode. Re-rendering for visual empathy.",
  },
  code: {
    design: "[SYSTEM]: Dropping design layers. Initializing dev_environment.",
    code: "You're already here. Let's look at some logic.",
  },
  "center div": {
    design:
      "Ah, the ultimate quest for balance. Use Flexbox or Grid, but make it feel right.",
    code: "Just grid place-items-center. Why are we even talking about this?",
  },
  deadline: {
    design:
      "A deadline is just an opportunity to polish the micro-interactions one last time.",
    code: "A deadline is a terrifying beast that requires 48 hours of 'Ship or Die' energy.",
  },
  figma: {
    design: "My second home. Where dreams become prototypes.",
    code: "The place where designers make things that are impossible to build in a week.",
  },
};
