export const c = {
  deep: "#1A2BFF", blue: "#0A7BFF", cyan: "#1CCBFF",
  ink: "#0A0A0A", ink2: "#1F1F1F", steel: "#4A4A4A", ash: "#8C8C8C",
  line: "#DADDE2", mist: "#EEF0F3", surface: "#F5F7FA", tint: "#F0F6FF", pill: "#EEF2FA",
  darkBg: "#101212", darkTitle: "#DFE0E2", darkBody: "#A0A0A0", white: "#FFFFFF", error: "#E5484D",
} as const;

export const gradient = "linear-gradient(to top, #1A2BFF, #0A7BFF 55%, #1CCBFF)";
export const gradientShort = "linear-gradient(to top, #1A2BFF, #0A7BFF)";
export const glow = "0 0 10px rgba(28,203,255,.8)";
export const glowRing = "0 0 0 3px rgba(28,203,255,.35), 0 0 16px rgba(28,203,255,.45)";
export const focusRing = "0 0 0 4px rgba(28,203,255,.18), 0 0 12px rgba(28,203,255,.4)";
export const ease = [0.2, 0.8, 0.2, 1] as const;

export const font = {
  sora: "var(--font-sora), sans-serif",
  mono: "var(--font-mono), monospace",
  wordmark: "var(--font-montserrat), sans-serif",
};

export const eyebrow = { font: `500 11px/1 ${"var(--font-mono), monospace"}`, letterSpacing: ".14em", textTransform: "uppercase" as const };
