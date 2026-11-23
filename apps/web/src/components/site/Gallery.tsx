"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal, CloseButton } from "@/components/ui/Overlay";
import { Phone } from "@/components/devices/Phone";
import { NeonDisc, Dot } from "@/components/brand/Neon";
import { Button } from "@/components/ui/Button";
import type { AppEntry } from "@/content/site";
import { c } from "@/lib/tokens";

export function Gallery({ app, onClose }: { app: AppEntry | null; onClose: () => void }) {
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [app?.slug]);
  const n = app?.screens.length ?? 1;
  const arrow = (dir: -1 | 1): React.CSSProperties => ({ position: "absolute", [dir < 0 ? "left" : "right"]: 16, top: "50%", marginTop: -24, width: 48, height: 48, borderRadius: "50%", background: "#FFF", border: "none", cursor: "pointer", fontSize: 20, boxShadow: "0 8px 24px -8px rgba(0,0,0,.35)", zIndex: 2 });
  return (
    <Modal open={!!app} onClose={onClose} width={1120}>
      {app && (
        <div className="md:min-h-[680px]" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))" }}>
          <div className="min-h-[440px] md:min-h-[680px]" style={{ position: "relative", background: app.bg, overflow: "hidden" }}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 0.9 }} transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }} style={{ position: "absolute", inset: 0 }}><NeonDisc size={520} style={{ left: "50%", top: "50%", marginLeft: -260, marginTop: -260 }} /></motion.div>
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, x: 40, rotate: 3 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -40, rotate: -3 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }} className="top-6 origin-top scale-[.62] md:top-[50px] md:scale-100" style={{ position: "absolute", left: "50%", marginLeft: -140 }}>
                <Phone device="iphone" src={app.screens[i].src} crop={app.crop} width={280} alt={app.screens[i].caption} />
              </motion.div>
            </AnimatePresence>
            <motion.button whileHover={{ scale: 1.06, boxShadow: "0 0 0 3px rgba(28,203,255,.5), 0 0 16px rgba(28,203,255,.6)" }} whileTap={{ scale: 0.92, x: -3 }} aria-label="Previous" onClick={() => setI((i + n - 1) % n)} style={arrow(-1)}>←</motion.button>
            <motion.button whileHover={{ scale: 1.06, boxShadow: "0 0 0 3px rgba(28,203,255,.5), 0 0 16px rgba(28,203,255,.6)" }} whileTap={{ scale: 0.92, x: 3 }} aria-label="Next" onClick={() => setI((i + 1) % n)} style={arrow(1)}>→</motion.button>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="px-5 py-6 md:px-9 md:py-10" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ font: "500 10.5px/1 var(--font-mono), monospace", letterSpacing: ".14em", color: c.steel }}>SCREEN {i + 1} / {n}</span><CloseButton onClick={onClose} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><span style={{ font: "800 clamp(30px, 4vw, 40px)/1 var(--font-sora), sans-serif", letterSpacing: "-0.035em" }}>{app.name}</span><span style={{ font: "400 15px/1.55 var(--font-sora), sans-serif", color: c.steel }}>{app.line}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: c.surface, borderRadius: 14, overflow: "hidden" }}><Dot /><AnimatePresence mode="wait"><motion.span key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} style={{ font: "600 15px/1.3 var(--font-sora), sans-serif" }}>{app.screens[i].caption}</motion.span></AnimatePresence></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: "auto" }}>
              {app.screens.map((s, k) => (
                <motion.button key={s.src} onClick={() => setI(k)} whileHover={{ borderColor: c.cyan, y: -3 }} whileTap={{ scale: 0.96 }} className="h-[150px] md:h-[200px]" style={{ position: "relative", borderRadius: 16, background: app.bg, border: `2px solid ${k === i ? c.cyan : "transparent"}`, boxShadow: k === i ? "0 0 12px rgba(28,203,255,.6)" : "none", overflow: "hidden", cursor: "pointer", padding: 0 }}>
                  <Phone device="iphone" src={s.src} crop={app.crop} width={78} style={{ position: "absolute", left: "50%", top: 18, marginLeft: -39, pointerEvents: "none" }} />
                </motion.button>
              ))}
            </div>
            <Button href="/claim" dot full size="lg">I want one like this</Button>
          </motion.div>
        </div>
      )}
    </Modal>
  );
}
