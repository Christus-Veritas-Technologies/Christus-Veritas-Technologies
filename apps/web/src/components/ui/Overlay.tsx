"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { c, ease } from "@/lib/tokens";

function useEsc(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, onClose]);
}

/**
 * Overlays render into document.body so animated (transformed) sections never
 * become their containing block and clip or offset them.
 */
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

const backdrop = (onClose: () => void, blur = true) => (
  <motion.div key="bd" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(10,10,10,.6)", backdropFilter: blur ? "blur(6px)" : undefined }} />
);

export function CloseButton({ onClick, light = false }: { onClick: () => void; light?: boolean }) {
  return (
    <motion.button aria-label="Close" onClick={onClick} whileHover={{ rotate: 90, boxShadow: "0 0 0 3px rgba(28,203,255,.5)" }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.2, ease }}
      style={{ flex: "none", width: 40, height: 40, borderRadius: "50%", border: light ? "none" : `1.5px solid ${c.line}`, background: light ? "#FFF" : "transparent", display: "grid", placeItems: "center", cursor: "pointer", fontSize: 20, color: c.ink }}>×</motion.button>
  );
}

/** Centred modal with the gradient-corner border. */
export function Modal({ open, onClose, width = 600, children }: { open: boolean; onClose: () => void; width?: number; children: React.ReactNode }) {
  useEsc(open, onClose);
  return (
    <Portal>
      <AnimatePresence>
        {open && (<>
          {backdrop(onClose)}
          <div key="mw" style={{ position: "fixed", inset: 0, zIndex: 91, display: "grid", placeItems: "center", padding: 12, pointerEvents: "none" }}>
            <motion.div role="dialog" aria-modal initial={{ opacity: 0, y: 32, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.35, ease }}
              style={{ pointerEvents: "auto", width: `min(${width}px, 100%)`, maxHeight: "calc(100dvh - 24px)", overflow: "auto", borderRadius: 28, border: "2.4px solid transparent", background: "linear-gradient(#FFF,#FFF) padding-box, linear-gradient(135deg,#1A2BFF 0%,#0A7BFF 14%,rgba(10,123,255,0) 34%,rgba(28,203,255,0) 66%,#1CCBFF 88%,#0A7BFF 100%) border-box", boxShadow: "0 40px 120px -40px rgba(0,0,0,.6)" }}>
              {children}
            </motion.div>
          </div>
        </>)}
      </AnimatePresence>
    </Portal>
  );
}

/** Right-side drawer. */
export function Drawer({ open, onClose, width = 480, children }: { open: boolean; onClose: () => void; width?: number; children: React.ReactNode }) {
  useEsc(open, onClose);
  return (
    <Portal>
      <AnimatePresence>
        {open && (<>
          {backdrop(onClose, false)}
          <motion.aside key="d" role="dialog" aria-modal initial={{ x: "105%" }} animate={{ x: 0 }} exit={{ x: "105%" }} transition={{ duration: 0.45, ease }}
            style={{ position: "fixed", zIndex: 91, top: 0, right: 0, bottom: 0, width: `min(${width}px, 100vw)`, background: "#FFF", boxShadow: "-30px 0 80px -30px rgba(0,0,0,.45)", display: "flex", flexDirection: "column", overflow: "auto" }}>
            {children}
          </motion.aside>
        </>)}
      </AnimatePresence>
    </Portal>
  );
}
