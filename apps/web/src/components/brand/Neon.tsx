import { c } from "@/lib/tokens";

const pattern = (tile: number) => ({ backgroundImage: `url(/brand/icon-pattern.svg), linear-gradient(to top, #1A2BFF, #0A7BFF 55%, #1CCBFF)`, backgroundSize: `${tile}px auto, 100% 100%`, backgroundRepeat: "repeat, no-repeat" });

/** Blue panel: icon pattern, deep-blue scrim, glowing white frame inset 16px. */
export function NeonPanel({ children, radius = 36, scrim = "linear-gradient(100deg, rgba(26,43,255,.97) 0%, rgba(26,43,255,.9) 48%, rgba(26,43,255,.55) 100%)", tile = 120, style, className }: { children?: React.ReactNode; radius?: number; scrim?: string; tile?: number; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={className} style={{ position: "relative", borderRadius: radius, overflow: "hidden", background: c.deep, color: "#FFF", ...style }}>
      <div style={{ position: "absolute", inset: 0, ...pattern(tile) }} />
      <div style={{ position: "absolute", inset: 0, background: scrim }} />
      <div style={{ position: "absolute", inset: 16, border: "2.6px solid #FFF", borderRadius: Math.max(radius - 12, 8), boxShadow: "0 0 12px rgba(28,203,255,.9), inset 0 0 10px rgba(28,203,255,.7)", opacity: 0.9, pointerEvents: "none" }} />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

/** Round icon-pattern disc with the cyan ridge ring offset around it. Position it with style. */
export function NeonDisc({ size, tile = 110, ring = 9, style }: { size: number | string; tile?: number; ring?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: size, height: size, ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", ...pattern(tile) }} />
      <div style={{ position: "absolute", inset: -ring, border: "2.6px solid #1CCBFF", borderRadius: "50%", boxShadow: "0 0 10px rgba(28,203,255,.8), inset 0 0 8px rgba(28,203,255,.6)" }} />
    </div>
  );
}

export function Eyebrow({ children, color = c.steel, style }: { children: React.ReactNode; color?: string; style?: React.CSSProperties }) {
  return <span style={{ font: "500 11px/1 var(--font-mono), monospace", letterSpacing: ".14em", textTransform: "uppercase", color, ...style }}>{children}</span>;
}

export function Dot({ size = 7, color = c.cyan }: { size?: number; color?: string }) {
  return <span style={{ width: size, height: size, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}`, flex: "none", display: "inline-block" }} />;
}
