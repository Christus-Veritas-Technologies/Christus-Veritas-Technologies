"use client";
import { ClaimForm } from "@/components/site/ClaimForm";
import { WhyModal } from "@/components/site/WhyModal";
import { NeonPanel, Eyebrow, Dot } from "@/components/brand/Neon";
import { SpotTracker } from "@/components/ui/Offer";
import { offer } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Motion";
import { c } from "@/lib/tokens";

export default function Claim() {
  return (
    <Section className="grid grid-cols-1 gap-5 px-3 pb-3 sm:px-5 sm:pb-5 lg:grid-cols-[minmax(0,560px)_1fr]" style={{ minHeight: "calc(100dvh - 90px)", alignItems: "start" }}>
      <NeonPanel radius={32} scrim="linear-gradient(to bottom, rgba(26,43,255,.95) 0%, rgba(26,43,255,.82) 100%)" className="lg:sticky lg:top-24">
        <Reveal className="px-7 py-10 md:px-14 md:py-16" style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <Eyebrow color="#FFF">Claim 1 of 5 spots</Eyebrow>
          <h1 style={{ margin: 0, font: "800 clamp(36px, 5vw, 60px)/0.98 var(--font-sora), sans-serif", letterSpacing: "-0.045em" }}>A $1,200 app. Yours for $100.</h1>
          <p style={{ margin: 0, font: "400 16px/1.6 var(--font-sora), sans-serif" }}>We're building our portfolio. We read every application and pick the 5 projects we can deliver best.</p>
          <div style={{ alignSelf: "flex-start", padding: "14px 18px", background: "rgba(255,255,255,.1)", border: "1.5px solid rgba(255,255,255,.5)", borderRadius: 16 }}><SpotTracker left={offer.spotsLeft} onBlue /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{offer.included.map((i) => <span key={i} style={{ display: "flex", alignItems: "center", gap: 12, font: "500 15px/1.3 var(--font-sora), sans-serif" }}><Dot />{i}</span>)}</div>
          <div style={{ padding: "18px 20px", background: "#FFF", color: c.ink, borderRadius: 18, display: "flex", flexDirection: "column", gap: 6 }}><Eyebrow style={{ fontSize: 10 }}>How payment works</Eyebrow><span style={{ font: "600 15px/1.45 var(--font-sora), sans-serif" }}>{offer.payment}</span></div>
          <WhyModal />
        </Reveal>
      </NeonPanel>
      <Reveal delay={0.1} className="px-2 py-8 sm:px-6 md:py-14 lg:px-[clamp(24px,5vw,88px)]" style={{ maxWidth: 820 }}>
        <ClaimForm onSubmit={async (data) => { await fetch("/api/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(() => {}); }} />
      </Reveal>
    </Section>
  );
}
