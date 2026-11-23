"use client";
import { motion } from "framer-motion";
import { c, gradientShort } from "@/lib/tokens";

/** Pill tabs. The active neon pill slides between tabs (shared layoutId). */
export function Tabs<T extends string>({ tabs, value, onChange, id = "tabs" }: { tabs: { key: T; label: string; count?: number }[]; value: T; onChange: (k: T) => void; id?: string }) {
  return (
    <div role="tablist" className="no-scrollbar" style={{ display: "inline-flex", maxWidth: "100%", overflowX: "auto", padding: 5, gap: 4, border: `1.5px solid #E6E6E6`, borderRadius: 999 }}>
      {tabs.map((t) => {
        const on = t.key === value;
        return (
          <motion.button key={t.key} role="tab" aria-selected={on} onClick={() => onChange(t.key)} whileHover={on ? undefined : { color: c.ink, y: -1 }} whileTap={{ scale: 0.95 }} style={{ position: "relative", flex: "none", whiteSpace: "nowrap", border: "none", background: "transparent", cursor: "pointer", padding: "11px 18px", borderRadius: 999, font: "600 13.5px/1 var(--font-sora), sans-serif", color: on ? "#FFF" : c.steel }}>
            {on && <motion.span layoutId={`${id}-pill`} transition={{ type: "spring", stiffness: 420, damping: 34 }} style={{ position: "absolute", inset: 0, borderRadius: 999, background: gradientShort, boxShadow: "0 0 0 3px rgba(28,203,255,.25), 0 0 14px rgba(28,203,255,.45)" }} />}
            <span style={{ position: "relative" }}>{t.label}{t.count != null && <span style={{ opacity: 0.6, fontWeight: 500 }}> {t.count}</span>}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
