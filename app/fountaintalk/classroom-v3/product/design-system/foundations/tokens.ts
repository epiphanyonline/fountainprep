export const colors = {
  canvas: "#F7F3EB",
  paper: "#FFFDF8",
  ink: "#211F1B",
  muted: "#726D64",
  line: "#DED7CA",
  forest: "#365244",
  forestDeep: "#21372D",
  olive: "#71805B",
  gold: "#C59A45",
  goldSoft: "#E8D7B0",
  sky: "#AFC6D4",
  night: "#101722",
  nightRaised: "#17212D",
  nightInk: "#F8F3E8",
  success: "#55785E",
  warning: "#AA7436",
  danger: "#9D4A46",
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

export const radius = {
  sm: "0.625rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  pill: "999px",
} as const;

export const shadow = {
  soft: "0 12px 40px rgba(42, 34, 21, 0.08)",
  lifted: "0 24px 70px rgba(42, 34, 21, 0.14)",
  night: "0 30px 90px rgba(0, 0, 0, 0.34)",
} as const;

export const motion = {
  instant: "100ms",
  quick: "180ms",
  calm: "320ms",
  cinematic: "700ms",
  ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
} as const;

export const typography = {
  display: '"Fraunces", "Iowan Old Style", Georgia, serif',
  body: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"SFMono-Regular", Consolas, monospace',
} as const;

export const breakpoints = {
  sm: "36rem",
  md: "48rem",
  lg: "64rem",
  xl: "75rem",
} as const;

export const designTokens = { colors, spacing, radius, shadow, motion, typography, breakpoints } as const;
export type FountainPrepDesignTokens = typeof designTokens;
