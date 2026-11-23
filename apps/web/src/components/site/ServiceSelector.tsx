"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services, apps } from "@/content/site";
import { NeonPanel, Dot, Eyebrow } from "@/components/brand/Neon";
import { Phone } from "@/components/devices/Phone";
import { CVTMark } from "@/components/brand/CVTMark";
import { Fit } from "@/components/ui/Motion";
import { c, ease } from "@/lib/tokens";

export function ServiceSelector() {
  const [i, setI] = useState(0);
  // Open the service named in the URL hash (links from the nav and home page).
  useEffect(() => {
    const pick = () => { const k = services.findIndex((s) => s.slug === window.location.hash.slice(1)); if (k >= 0) setI(k); };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, []);
  const s = services[i];
  const ph = s.phones.map((slug, k) => { const a = apps.find((x) => x.slug === slug)!; return { a, src: a.screens[slug === "smm-pos" ? (k === 0 ? 2 : 0) : 0].src }; });
  return (
    <div className="container grid grid-cols-1 gap-6 pb-20 md:pb-28 lg:grid-cols-[minmax(0,380px)_1fr]">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:flex lg:flex-col">
        {services.map((v, k) => {
          const on = k === i;
          return (
            <motion.button id={v.slug} key={v.slug} onClick={() => setI(k)} initial={false}
              whileHover={on ? { y: -2 } : { y: -2, borderColor: c.cyan }} whileTap={{ scale: 0.98 }}
              animate={{ backgroundColor: on ? c.ink : "#FFFFFF", color: on ? "#FFFFFF" : c.ink, borderColor: on ? c.cyan : c.mist, boxShadow: on ? "0 0 0 3px rgba(28,203,255,.18), 0 0 16px rgba(28,203,255,.35)" : "0 0 0 0 rgba(0,0,0,0)" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="px-5 py-5 md:px-6 md:py-6"
              style={{ textAlign: "left", cursor: "pointer", borderRadius: 22, borderWidth: 1.5, borderStyle: "solid", display: "flex", flexDirection: "column", gap: 10, scrollMarginTop: 120 }}>
              <span style={{ display: "flex", justifyContent: "space-between" }}><span style={{ font: "500 10.5px/1 var(--font-mono), monospace", letterSpacing: ".12em", color: on ? c.cyan : c.steel }}>{v.n}</span><motion.span animate={{ opacity: on ? 1 : 0.3, x: on ? 0 : -4 }}>→</motion.span></span>
              <span style={{ font: "800 clamp(22px, 2.4vw, 26px)/1.05 var(--font-sora), sans-serif", letterSpacing: "-0.03em" }}>{v.name}</span>
              <span style={{ font: "400 13.5px/1.45 var(--font-sora), sans-serif", opacity: 0.8 }}>{v.short}</span>
            </motion.button>
          );
        })}
      </div>
      <NeonPanel radius={32} style={{ minHeight: 560 }} scrim="linear-gradient(100deg, rgba(26,43,255,.97) 0%, rgba(26,43,255,.9) 52%, rgba(26,43,255,.5) 100%)">
        <AnimatePresence mode="wait">
          <motion.div key={s.slug} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease }} className="flex flex-col xl:block" style={{ position: "relative", minHeight: 560 }}>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }} className="p-8 md:p-[60px]" style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 20 }}>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}><Eyebrow color="#FFF">{s.n} · {s.name}</Eyebrow></motion.div>
              <motion.h2 variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} style={{ margin: 0, font: "800 clamp(28px, 3.4vw, 38px)/1.04 var(--font-sora), sans-serif", letterSpacing: "-0.035em" }}>{s.headline}</motion.h2>
              <motion.p variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} style={{ margin: 0, font: "400 16px/1.6 var(--font-sora), sans-serif" }}>{s.body}</motion.p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>{s.points.map((p) => <motion.span key={p} variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} style={{ display: "flex", alignItems: "center", gap: 12, font: "500 15px/1.35 var(--font-sora), sans-serif" }}><Dot />{p}</motion.span>)}</div>
              <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}><Eyebrow color="#FFF" style={{ opacity: 0.8 }}>Built for</Eyebrow><span style={{ padding: "7px 12px", background: "#FFF", color: c.deep, borderRadius: 999, font: "600 12px/1 var(--font-sora), sans-serif" }}>{s.proof}</span></motion.div>
            </motion.div>
            {/* Visual: flows under the copy on small screens, pinned right on wide screens. */}
            <div className="mx-auto w-full max-w-[380px] px-6 pb-8 xl:absolute xl:top-0 xl:right-0 xl:bottom-0 xl:p-0 xl:pt-24">
              <Fit width={380} height={500} className="mx-auto">
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease }} style={{ position: "relative", width: 380, height: 500 }}>
                  {ph.length ? (<>
                    <Phone device="galaxy" src={ph[0].src} crop={ph[0].a.crop} width={160} style={{ position: "absolute", right: 176, top: 72, rotate: "-6deg" }} />
                    <Phone device="iphone" src={ph[1].src} crop={ph[1].a.crop} width={176} style={{ position: "absolute", right: 52, top: 40, rotate: "5deg" }} />
                  </>) : (
                    <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", right: 56, top: 120, width: 260, height: 260, borderRadius: "50%", background: "#FFF", display: "grid", placeItems: "center", boxShadow: "0 0 0 10px rgba(255,255,255,.12), 0 0 0 12.5px #1CCBFF, 0 0 24px 12px rgba(28,203,255,.45)" }}><CVTMark size={186} /></motion.div>
                  )}
                </motion.div>
              </Fit>
            </div>
          </motion.div>
        </AnimatePresence>
      </NeonPanel>
    </div>
  );
}
