import { NeonPanel, Eyebrow, Dot } from "@/components/brand/Neon";
import { CVTMark } from "@/components/brand/CVTMark";
import { Button } from "@/components/ui/Button";
import { SpotTracker, DayBar } from "@/components/ui/Offer";
import { Reveal } from "@/components/ui/Reveal";
import { HoverLift, Section } from "@/components/ui/Motion";
import { offer, steps } from "@/content/site";
import { c } from "@/lib/tokens";

const h2: React.CSSProperties = { margin: 0, font: "800 clamp(32px, 4.4vw, 54px)/1.02 var(--font-sora), sans-serif", letterSpacing: "-0.04em", textWrap: "balance" as never };

export function SectionHead({ eyebrow, title, accent, light = false }: { eyebrow: string; title: string; accent?: string; light?: boolean }) {
  return (
    <Reveal style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 700 }}>
      <Eyebrow color={light ? "#8C8C8C" : c.steel}>{eyebrow}</Eyebrow>
      <h2 style={h2}>{title} {accent && <span className="grad-text">{accent}</span>}</h2>
    </Reveal>
  );
}

export function OfferTiles() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.15fr_1fr]" style={{ color: c.ink }}>
      <HoverLift lift={4} className="sm:row-span-2" style={{ padding: 22, background: "#FFF", borderRadius: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}><span className="grad-text" style={{ font: "800 clamp(64px, 8vw, 84px)/0.85 var(--font-sora), sans-serif", letterSpacing: "-0.05em" }}>15</span><span style={{ font: "600 15px/1.25 var(--font-sora), sans-serif" }}>screens,<br />designed<br />and built</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>{Array.from({ length: 15 }, (_, i) => <span key={i} style={{ height: 28, borderRadius: 5, border: "1.5px solid #0A7BFF", background: "linear-gradient(to bottom, rgba(10,123,255,.18) 0 6px, transparent 6px)" }} />)}</div>
      </HoverLift>
      <HoverLift lift={4} style={{ padding: 20, background: c.ink, color: "#FFF", borderRadius: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span style={{ font: "800 40px/1 var(--font-sora), sans-serif" }}>10</span><span style={{ font: "600 14px/1 var(--font-sora), sans-serif" }}>days to go live</span></div>
        <DayBar dark height={9} />
      </HoverLift>
      <HoverLift lift={4} style={{ padding: 20, border: "1.5px solid rgba(255,255,255,.75)", background: "rgba(255,255,255,.1)", color: "#FFF", borderRadius: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span style={{ font: "800 40px/1 var(--font-sora), sans-serif" }}>2</span><span style={{ font: "600 14px/1 var(--font-sora), sans-serif" }}>rounds of revisions</span></div>
        <div style={{ display: "flex", gap: 6 }}>{["Round 1", "Round 2"].map((r) => <span key={r} style={{ padding: "6px 11px", background: "#FFF", color: c.deep, borderRadius: 999, font: "600 11px/1 var(--font-sora), sans-serif" }}>{r}</span>)}</div>
      </HoverLift>
      <HoverLift lift={4} className="sm:col-span-2" style={{ padding: "18px 22px", background: "linear-gradient(90deg,#FFF 0%,#FFF 50%,#E9F4FF 100%)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ font: "800 40px/1 var(--font-sora), sans-serif" }}>$0</span><span style={{ font: "600 14px/1.25 var(--font-sora), sans-serif" }}>hidden<br />costs</span></div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><span style={{ padding: "7px 12px", border: "1.5px solid #0A7BFF", borderRadius: 999, font: "600 12px/1 var(--font-sora), sans-serif" }}>Design included</span><span style={{ padding: "7px 12px", background: "linear-gradient(to top,#1A2BFF,#0A7BFF)", color: "#FFF", borderRadius: 999, font: "600 12px/1 var(--font-sora), sans-serif" }}>Development included</span></div>
      </HoverLift>
    </div>
  );
}

export function OfferSection() {
  return (
    <Section id="offer" className="px-3 py-16 sm:px-5 md:py-24">
      <NeonPanel style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ padding: "clamp(36px, 6vw, 80px) clamp(28px, 6vw, 80px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: 48, alignItems: "center" }}>
          <Reveal style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22 }}>
            <Eyebrow color="#FFF">The $100 offer · first 5 businesses</Eyebrow>
            <h2 style={{ margin: 0, font: "800 clamp(36px, 5.4vw, 68px)/0.98 var(--font-sora), sans-serif", letterSpacing: "-0.045em" }}>A $1,200 app. Yours for $100.</h2>
            <p style={{ margin: 0, maxWidth: 460, font: "400 clamp(16px, 1.5vw, 17px)/1.55 var(--font-sora), sans-serif" }}>We're building our portfolio, so the first 5 businesses get the full build at a fraction of the price. That's the only catch.</p>
            <div style={{ padding: "14px 18px", background: "rgba(255,255,255,.1)", border: "1.5px solid rgba(255,255,255,.5)", borderRadius: 16 }}><SpotTracker left={offer.spotsLeft} onBlue /></div>
            <Button variant="onBlue" href="/claim" dot size="lg">Claim your spot</Button>
          </Reveal>
          <Reveal delay={0.15}><OfferTiles /></Reveal>
        </div>
      </NeonPanel>
    </Section>
  );
}

export function HowItWorks() {
  return (
    <Section className="pt-6 pb-16 md:pb-26">
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        <SectionHead eyebrow="How it works" title="From idea to" accent="live app in 10 days." />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <HoverLift lift={3} style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(to top,#1A2BFF,#0A7BFF)", color: "#FFF", display: "grid", placeItems: "center", font: "800 17px/1 var(--font-sora), sans-serif", boxShadow: i === steps.length - 1 ? "0 0 0 4px #FFF, 0 0 0 6.5px #1CCBFF, 0 0 14px 6px rgba(28,203,255,.45)" : "none" }}>{s.n}</HoverLift>
              <span style={{ font: "700 19px/1.25 var(--font-sora), sans-serif" }}>{s.title}</span>
              <span style={{ font: "400 14.5px/1.55 var(--font-sora), sans-serif", color: c.steel }}>{s.body}</span>
            </Reveal>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><DayBar /><div style={{ display: "flex", justifyContent: "space-between", font: "500 10.5px/1 var(--font-mono), monospace", letterSpacing: ".12em", color: c.steel }}><span>DAY 1</span><span>DAY 10 · LIVE</span></div></div>
      </div>
    </Section>
  );
}

export function FinalCTA({ title = "5 spots.", accent = "Claim yours.", body = "Tell us about your business and your idea. If it's a fit, your designs start this week." }: { title?: string; accent?: string; body?: string }) {
  return (
    <Section className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="px-5 md:px-7" style={{ position: "relative", maxWidth: 1280, margin: "0 auto", borderRadius: 36, overflow: "hidden", background: c.surface, paddingTop: "clamp(56px, 8vw, 104px)", paddingBottom: "clamp(56px, 8vw, 104px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24 }}>
        <div style={{ position: "absolute", left: "50%", top: -260, width: 520, height: 520, marginLeft: -260, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(10,123,255,.18), rgba(10,123,255,0))" }} />
        <CVTMark size={140} />
        <Reveal><h2 style={{ position: "relative", margin: 0, font: "800 clamp(38px, 5.6vw, 72px)/0.98 var(--font-sora), sans-serif", letterSpacing: "-0.045em" }}>{title} <span className="grad-text">{accent}</span></h2></Reveal>
        <Reveal delay={0.08}><p style={{ position: "relative", margin: 0, maxWidth: 480, font: "400 clamp(16px, 1.5vw, 17px)/1.55 var(--font-sora), sans-serif", color: c.steel }}>{body}</p></Reveal>
        <Reveal delay={0.16} style={{ position: "relative", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}><Button href="/claim" dot size="lg">Claim a $100 spot</Button><Button variant="secondary" size="lg" href="#">Chat on WhatsApp</Button></Reveal>
      </div>
    </Section>
  );
}

export { Dot };
