"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { c } from "@/lib/tokens";

export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: string }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={it.q} style={{ borderTop: "1px solid #E6E6E6" }}>
            <motion.button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} initial={false} whileHover={{ x: 4, color: c.blue }} whileTap={{ scale: 0.99 }} animate={{ color: on ? c.blue : c.ink, x: 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} style={{ width: "100%", border: "none", background: "none", cursor: "pointer", padding: "22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, textAlign: "left", font: "700 clamp(16px, 2.2vw, 18px)/1.3 var(--font-sora), sans-serif" }}>
              <span>{it.q}</span>
              <motion.span animate={{ rotate: on ? 45 : 0, borderColor: on ? c.cyan : c.line, backgroundColor: on ? "rgba(28,203,255,.1)" : "rgba(28,203,255,0)" }} style={{ flex: "none", width: 30, height: 30, borderRadius: "50%", border: "1.5px solid", display: "grid", placeItems: "center", color: c.blue, fontSize: 18 }}>+</motion.span>
            </motion.button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }} style={{ overflow: "hidden" }}>
                  <motion.p initial={{ y: -8 }} animate={{ y: 0 }} exit={{ y: -8 }} transition={{ duration: 0.3 }} style={{ margin: "0 0 22px", maxWidth: 560, font: "400 15.5px/1.6 var(--font-sora), sans-serif", color: c.steel }}>{it.a}</motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
