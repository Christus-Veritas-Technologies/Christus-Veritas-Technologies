"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CVTMark } from "@/components/brand/CVTMark";
import { Phone } from "@/components/devices/Phone";
import { apps, offer, services } from "@/content/site";
import { c, ease } from "@/lib/tokens";

const links: { href: Route; label: string; menu?: boolean }[] = [{ href: "/", label: "Home" }, { href: "/work", label: "Work" }, { href: "/services", label: "Services", menu: true }, { href: "/about", label: "About" }];
const recent = ["smm-pos", "visualform", "iron-sets", "staticwave"].map((s) => apps.find((a) => a.slug === s)!);

const claimStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, border: "2px solid transparent", background: "linear-gradient(#0A0A0A,#0A0A0A) padding-box, linear-gradient(90deg,#1A2BFF,#0A7BFF 45%,#1CCBFF) border-box", color: "#FFF", borderRadius: 999, font: "600 13.5px/1 var(--font-sora), sans-serif", whiteSpace: "nowrap" };

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  // Close menus whenever the route changes.
  useEffect(() => { setOpen(false); setMobile(false); }, [path]);
  // Lock page scroll behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobile]);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 80, padding: "12px 12px", display: "flex", justifyContent: "center" }} onMouseLeave={() => setOpen(false)}>
      <motion.nav initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease }}
        className="w-full md:w-auto"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, padding: 6, background: "rgba(255,255,255,.86)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid #E6E9EE", borderRadius: 999, boxShadow: "0 14px 36px -16px rgba(10,20,80,.28)" }}>
        <motion.span whileHover={{ rotate: -8, scale: 1.05 }} whileTap={{ scale: 0.94 }} transition={{ duration: 0.25, ease }} style={{ borderRadius: "50%", marginRight: 4 }}>
          <Link href="/" aria-label="CVT home" style={{ width: 46, height: 46, borderRadius: "50%", background: "#FFF", boxShadow: "inset 0 0 0 1px #EEF0F3", display: "grid", placeItems: "center" }}><CVTMark size={38} animate={false} /></Link>
        </motion.span>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
          {links.map((l) => {
            const on = isActive(l.href) || (l.menu && open);
            const style: React.CSSProperties = { position: "relative", padding: "12px 18px", borderRadius: 999, font: `${isActive(l.href) ? 600 : 500} 14px/1 var(--font-sora), sans-serif`, color: isActive(l.href) ? c.ink : c.steel, display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer" };
            const pill = on && <motion.span layoutId="nav-pill" transition={{ type: "spring", stiffness: 420, damping: 36 }} style={{ position: "absolute", inset: 0, borderRadius: 999, background: c.pill, zIndex: -1 }} />;
            return (
              <motion.span key={l.href} whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} style={{ position: "relative", zIndex: 0 }}>
                {l.menu ? (
                  <button style={style} onClick={() => setOpen((o) => !o)} onMouseEnter={() => setOpen(true)} aria-expanded={open}>{pill}{l.label}<motion.span animate={{ rotate: open ? 180 : 0 }} style={{ fontSize: 8 }}>▼</motion.span></button>
                ) : (
                  <Link href={l.href} style={style} onMouseEnter={() => setOpen(false)}>{pill}{l.label}</Link>
                )}
              </motion.span>
            );
          })}
          <span style={{ width: 1, height: 24, background: "#E6E9EE", margin: "0 8px" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <motion.span whileHover={{ boxShadow: "0 0 18px rgba(28,203,255,.55)", y: -1 }} whileTap={{ scale: 0.96 }} style={{ borderRadius: 999 }}>
            <Link href="/claim" className="px-4 py-3 md:px-5" style={claimStyle}>Claim a $100 spot</Link>
          </motion.span>
          {/* Mobile menu toggle */}
          <motion.button className="grid place-items-center md:hidden" whileTap={{ scale: 0.9 }} onClick={() => setMobile((m) => !m)} aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile}
            style={{ width: 46, height: 46, borderRadius: "50%", border: "none", background: c.pill, cursor: "pointer" }}>
            <span style={{ position: "relative", width: 18, height: 12 }}>
              {[0, 1, 2].map((k) => (
                <motion.span key={k} animate={mobile ? (k === 1 ? { opacity: 0, scaleX: 0 } : { top: 5, rotate: k === 0 ? 45 : -45 }) : { top: k * 5, rotate: 0, opacity: 1, scaleX: 1 }} transition={{ duration: 0.25, ease }}
                  style={{ position: "absolute", left: 0, width: 18, height: 2, borderRadius: 2, background: c.ink }} />
              ))}
            </span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Desktop mega menu */}
      <AnimatePresence>
        {open && (
          <motion.div className="hidden md:block" initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ duration: 0.25, ease }}
            style={{ position: "absolute", top: 80, left: "50%", translateX: "-50%", transformOrigin: "top center", width: "min(1120px, calc(100vw - 32px))", maxHeight: "calc(100dvh - 100px)", overflowY: "auto", borderRadius: 28, background: "#FFF", boxShadow: "0 40px 80px -30px rgba(10,20,80,.35), 0 0 0 1px #EEF0F3" }}>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} style={{ padding: "36px 40px 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 28 }}>
              {services.map((s) => (
                <motion.div key={s.slug} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -3 }}>
                  <Link href={`/services#${s.slug}`} onClick={() => setOpen(false)} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <span style={{ font: "500 10px/1 var(--font-mono), monospace", letterSpacing: ".12em", color: c.blue }}>{s.n}</span>
                    <span style={{ font: "700 17px/1.2 var(--font-sora), sans-serif" }}>{s.name}</span>
                    <span style={{ font: "400 13px/1.5 var(--font-sora), sans-serif", color: c.steel }}>{s.short}</span>
                    <span style={{ font: "500 10px/1.5 var(--font-mono), monospace", letterSpacing: ".08em", color: c.ash, textTransform: "uppercase" }}>{s.proof}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <div style={{ padding: "0 40px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ font: "800 26px/1 var(--font-sora), sans-serif", letterSpacing: "-0.03em" }}>Recent work</span><Link href="/work" onClick={() => setOpen(false)} style={{ font: "600 13px/1 var(--font-sora), sans-serif" }}>All work →</Link></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                {recent.map((a, i) => (
                  <motion.div key={a.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease }} whileHover={{ y: -3, boxShadow: "0 0 0 2px #1CCBFF, 0 18px 36px -18px rgba(10,123,255,.5)" }} style={{ position: "relative", height: 220, borderRadius: 18, overflow: "hidden", background: a.bg }}>
                    <Link href={`/work?app=${a.slug}`} onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0 }}>
                      <Phone device="iphone" src={a.screens[0].src} crop={a.crop} width={104} style={{ position: "absolute", left: "50%", top: 24, marginLeft: -52 }} />
                      <span style={{ position: "absolute", left: 12, bottom: 12, padding: "7px 11px", background: "rgba(255,255,255,.92)", borderRadius: 999, font: "600 12px/1 var(--font-sora), sans-serif", color: c.ink }}>{a.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            <Link href="/claim" onClick={() => setOpen(false)} style={{ display: "flex", justifyContent: "space-between", padding: "18px 40px", background: c.deep, color: "#FFF", borderTop: "2px solid #1CCBFF", font: "600 14px/1 var(--font-sora), sans-serif" }}><span>The $100 app offer · first 5 businesses · up to 15 screens, live in 10 days</span><span>→</span></Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobile && (
          <motion.div className="md:hidden" initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }} transition={{ duration: 0.28, ease }}
            style={{ position: "absolute", top: 76, left: 12, right: 12, maxHeight: "calc(100dvh - 92px)", overflowY: "auto", borderRadius: 28, background: "#FFF", boxShadow: "0 40px 80px -30px rgba(10,20,80,.45), 0 0 0 1px #EEF0F3", transformOrigin: "top center" }}>
            <motion.nav initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }} style={{ padding: "12px 12px 4px", display: "flex", flexDirection: "column" }}>
              {links.map((l) => (
                <motion.div key={l.href} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}>
                  <Link href={l.href} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 14px", borderRadius: 16, background: isActive(l.href) ? c.pill : "transparent", font: "700 22px/1 var(--font-sora), sans-serif", letterSpacing: "-0.02em" }}>
                    {l.label}<span style={{ color: isActive(l.href) ? c.blue : c.ash, fontSize: 18 }}>→</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} style={{ padding: "14px 14px 6px", display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ font: "500 10px/1 var(--font-mono), monospace", letterSpacing: ".14em", color: c.steel, textTransform: "uppercase", marginBottom: 6 }}>Services</span>
                {services.map((s) => (
                  <Link key={s.slug} href={`/services#${s.slug}`} style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "8px 0", font: "600 15px/1.3 var(--font-sora), sans-serif" }}>
                    <span style={{ font: "500 10px/1 var(--font-mono), monospace", color: c.blue }}>{s.n}</span>{s.name}
                  </Link>
                ))}
              </motion.div>
            </motion.nav>
            <Link href="/claim" style={{ display: "flex", flexDirection: "column", gap: 6, margin: 12, padding: "18px 20px", borderRadius: 20, background: c.deep, color: "#FFF", boxShadow: "inset 0 0 0 2px #1CCBFF" }}>
              <span style={{ font: "800 20px/1.1 var(--font-sora), sans-serif" }}>Claim a $100 app →</span>
              <span style={{ font: "500 12.5px/1.4 var(--font-sora), sans-serif", opacity: 0.85 }}>{offer.spotsLeft} of {offer.spots} spots left · live in 10 days</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
