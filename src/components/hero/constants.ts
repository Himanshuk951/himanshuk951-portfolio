export const heroBackgroundText = {
  idle: "PORTFOLIO",
  design: "CREATIVE",
  code: "ENGINEER",
} as const;

export const wipeVariants = {
  initial: (dir: "left" | "right") => ({
    x: dir === "left" ? "-100%" : "100%",
  }),
  animate: {
    x: "0%",
  },
};

