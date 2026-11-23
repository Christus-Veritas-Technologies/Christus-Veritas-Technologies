"use client";
import { motion } from "framer-motion";
import { Phone } from "@/components/devices/Phone";
import type { AppEntry } from "@/content/site";
import { c } from "@/lib/tokens";

export function AppCard({ app, featured = false, onOpen }: { app: AppEntry; featured?: boolean; onOpen?: () => void }) {
  const [a, b, d] = app.screens;
  return (
    <motion.button onClick={onOpen} initial="rest" whileHover="hover" animate="rest"
      variants={{ rest: { y: 0, borderColor: c.mist, boxShadow: "0 0 0 0 rgba(0,0,0,0)" }, hover: { y: -6, borderColor: c.cyan, boxShadow: "0 0 0 3px rgba(28,203,255,.15), 0 28px 56px -24px rgba(10,123,255,.45)" } }}
      whileTap={{ scale: 0.99 }} style={{ textAlign: "left", padding: 0, cursor: "pointer", borderRadius: 24, background: "#FFF", border: "1.5px solid", overflow: "hidden", display: "block", width: "100%" }}>
      <motion.div variants={{ rest: { scale: 1 }, hover: { scale: 1.02 } }} transition={{ duration: 0.4 }} className="h-[360px] sm:h-[400px]" style={{ position: "relative", background: app.bg, overflow: "hidden" }}>
        {featured ? (<>
          <Phone className="hidden sm:block" device="galaxy" src={b.src} crop={app.crop} width={170} style={{ position: "absolute", left: "calc(50% - 270px)", top: 64, rotate: "-6deg" }} />
          <Phone className="hidden sm:block" device="galaxy" src={d.src} crop={app.crop} width={170} style={{ position: "absolute", left: "calc(50% + 100px)", top: 64, rotate: "6deg" }} />
          <Phone device="iphone" src={a.src} crop={app.crop} width={186} style={{ position: "absolute", left: "calc(50% - 93px)", top: 40 }} />
        </>) : (
          <Phone device={app.hero} src={app.screens[app.slug === "iron-sets" ? 1 : app.slug === "staticwave" ? 1 : 0].src} crop={app.crop} width={170} style={{ position: "absolute", left: "calc(50% - 85px)", top: 48 }} />
        )}
      </motion.div>
      <div style={{ padding: "20px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><span style={{ font: "700 19px/1 var(--font-sora), sans-serif", color: c.ink }}>{app.name}</span><span style={{ font: "400 14px/1.45 var(--font-sora), sans-serif", color: c.steel }}>{app.line}</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "none" }}>
          <span style={{ padding: "6px 10px", background: "#F3F5F8", borderRadius: 999, font: "500 9.5px/1 var(--font-mono), monospace", letterSpacing: ".1em", textTransform: "uppercase", color: c.ink }}>{app.tag}</span>
          <motion.span variants={{ rest: { background: "#FFFFFF", color: c.ink, x: 0 }, hover: { background: c.blue, color: "#FFFFFF", x: 3 } }} style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid #DADDE2", display: "grid", placeItems: "center" }}>→</motion.span>
        </div>
      </div>
    </motion.button>
  );
}

export function ClientCard({ name, line, big, wide = false }: { name: string; line: string; big: string; wide?: boolean }) {
  return (
    <motion.div whileHover={{ y: -6, borderColor: c.cyan, boxShadow: "0 0 0 3px rgba(28,203,255,.15), 0 28px 56px -24px rgba(10,123,255,.45)" }} whileTap={{ scale: 0.99 }} style={{ gridColumn: wide ? "span 2" : undefined, borderRadius: 24, overflow: "hidden", border: `1.5px solid ${c.mist}`, background: "#FFF" }}>
      <div className="h-[300px] sm:h-[400px]" style={{ position: "relative", backgroundImage: "url(/brand/icon-pattern.svg), linear-gradient(to top,#1A2BFF,#0A7BFF 55%,#1CCBFF)", backgroundSize: "130px auto, 100% 100%" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(26,43,255,.8)" }} />
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, display: "flex", flexDirection: "column", gap: 10, color: "#FFF" }}><span style={{ font: "500 10px/1 var(--font-mono), monospace", letterSpacing: ".14em" }}>CLIENT SYSTEM</span><span style={{ font: "800 clamp(24px, 3vw, 30px)/1.05 var(--font-sora), sans-serif", letterSpacing: "-0.03em" }}>{big}</span></div>
      </div>
      <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 8 }}><span style={{ font: "700 19px/1 var(--font-sora), sans-serif" }}>{name}</span><span style={{ font: "400 14px/1.45 var(--font-sora), sans-serif", color: c.steel }}>{line}</span></div>
    </motion.div>
  );
}
