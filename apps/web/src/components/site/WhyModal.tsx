"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Modal, CloseButton } from "@/components/ui/Overlay";
import { Button } from "@/components/ui/Button";
import { CVTMark } from "@/components/brand/CVTMark";
import { c } from "@/lib/tokens";

export function WhyModal() {
  const [open, setOpen] = useState(false);
  const tile = (big: string, small: string) => <div style={{ padding: 14, background: c.surface, borderRadius: 14, display: "flex", flexDirection: "column", gap: 6 }}><span style={{ font: "800 22px/1 var(--font-sora), sans-serif", color: c.deep }}>{big}</span><span style={{ font: "500 12px/1.3 var(--font-sora), sans-serif", color: c.steel }}>{small}</span></div>;
  return (<>
    <motion.button onClick={() => setOpen(true)} whileHover={{ x: 4, borderBottomColor: "rgba(255,255,255,1)" }} whileTap={{ scale: 0.97 }} style={{ alignSelf: "flex-start", background: "none", border: "none", borderBottom: "1.5px solid rgba(255,255,255,.6)", padding: "0 0 4px", color: "#FFF", font: "600 15px/1 var(--font-sora), sans-serif", cursor: "pointer" }}>Why only $100? →</motion.button>
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="px-6 pt-8 pb-6 md:px-10 md:pt-10 md:pb-8" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><CVTMark size={72} /><CloseButton onClick={() => setOpen(false)} /></div>
        <span style={{ font: "800 clamp(28px, 4vw, 36px)/1.05 var(--font-sora), sans-serif", letterSpacing: "-0.035em" }}>Why only $100?</span>
        <p style={{ margin: 0, font: "400 16px/1.6 var(--font-sora), sans-serif", color: c.steel }}>We're building our portfolio. These 5 apps become projects we show future clients, so we price them to get started fast. Same design, same code, same care as a $1,200 build.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 10 }}>{tile("$1,200", "normal price")}{tile("$100", "first 5 only")}{tile("$0", "hidden costs")}</div>
      </div>
      <div className="px-6 py-5 md:px-10" style={{ background: c.surface, display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}><Button variant="secondary" onClick={() => setOpen(false)}>Got it</Button><Button dot onClick={() => setOpen(false)}>Continue my application</Button></div>
    </Modal>
  </>);
}
