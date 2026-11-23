"use client";
import { motion } from "framer-motion";
import { c } from "@/lib/tokens";

/** 5 dots, filled = taken. onBlue for white dots on the neon panel. */
export function SpotTracker({ total = 5, left, onBlue = false, size = 14, label = true }: { total?: number; left: number; onBlue?: boolean; size?: number; label?: boolean }) {
  const taken = total - left;
  const col = onBlue ? "#FFF" : c.blue;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span style={{ display: "flex", gap: size * 0.45 }}>
        {Array.from({ length: total }, (_, i) => (
          <motion.span key={i} initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${col}`, background: i < taken ? col : "transparent", boxShadow: onBlue ? "0 0 6px rgba(28,203,255,.9)" : "none" }} />
        ))}
      </span>
      {label && <span style={{ font: "600 14px/1.2 var(--font-sora), sans-serif" }}>{left === 0 ? "All 5 spots are taken" : `${left} of ${total} spots left`}</span>}
    </div>
  );
}

/** 10-segment day bar; the last segment glows. Animates in on scroll. */
export function DayBar({ days = 10, dark = false, height = 10 }: { days?: number; dark?: boolean; height?: number }) {
  return (
    <div style={{ display: "flex", gap: dark ? 4 : 6 }}>
      {Array.from({ length: days }, (_, i) => {
        const last = i === days - 1;
        const bg = last ? c.cyan : dark ? "rgba(255,255,255,.35)" : `rgba(10,123,255,${(0.18 + i * 0.07).toFixed(2)})`;
        return <motion.span key={i} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.3 }} style={{ flex: 1, height, borderRadius: 3, background: bg, boxShadow: last ? "0 0 10px #1CCBFF" : "none", transformOrigin: "left" }} />;
      })}
    </div>
  );
}

export function Price({ big = 44, onBlue = false }: { big?: number; onBlue?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <span className={onBlue ? undefined : "grad-text"} style={{ font: `800 ${big}px/1 var(--font-sora), sans-serif`, letterSpacing: "-0.035em", color: onBlue ? "#FFF" : undefined }}>$100</span>
      <span style={{ font: `600 ${Math.round(big * 0.38)}px/1 var(--font-sora), sans-serif`, color: onBlue ? "#FFF" : c.steel, textDecoration: "line-through", textDecorationThickness: 1.5 }}>$1,200</span>
    </div>
  );
}
