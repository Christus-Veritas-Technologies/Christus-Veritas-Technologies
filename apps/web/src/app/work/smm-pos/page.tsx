import Link from "next/link";
import { Phone } from "@/components/devices/Phone";
import { NeonDisc, NeonPanel, Eyebrow, Dot } from "@/components/brand/Neon";
import { Button } from "@/components/ui/Button";
import { Reveal, Float } from "@/components/ui/Reveal";
import { Fit, HoverLift, NudgeLink, Section } from "@/components/ui/Motion";
import { apps, smmCase } from "@/content/site";
import { c } from "@/lib/tokens";

export const metadata = { title: "SMM POS case study · CVT" };

export default function SmmPos() {
  const a = apps.find((x) => x.slug === "smm-pos")!;
  return (<>
    <Section className="container pt-6 pb-16 md:pt-10 md:pb-24" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))", gap: 40, alignItems: "center" }}>
      <Reveal style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
        <Eyebrow><NudgeLink href="/work" nudge={-3} style={{ display: "inline-block" }}>← Work</NudgeLink>  /  SMM POS</Eyebrow>
        <h1 style={{ margin: 0, font: "800 clamp(40px, 6vw, 76px)/0.98 var(--font-sora), sans-serif", letterSpacing: "-0.045em" }}>A till that <span className="grad-text">never loses a sale.</span></h1>
        <p style={{ margin: 0, maxWidth: 480, font: "400 clamp(16px, 1.6vw, 18px)/1.55 var(--font-sora), sans-serif", color: c.steel }}>{smmCase.intro}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{smmCase.chips.map((t) => <span key={t} style={{ padding: "9px 14px", border: `1.5px solid ${c.line}`, borderRadius: 999, font: "600 13px/1 var(--font-sora), sans-serif" }}>{t}</span>)}</div>
      </Reveal>
      <Reveal delay={0.15} y={40}><Fit width={660} height={640} className="mx-auto"><div style={{ position: "relative", width: 660, height: 640 }}>
        <NeonDisc size={620} tile={140} style={{ left: 40, top: 10 }} />
        <Float delay={0.5} style={{ position: "absolute", left: 40, top: 140 }}><Phone device="galaxy" src={a.screens[2].src} crop={a.crop} width={190} style={{ rotate: "-6deg" }} /></Float>
        <Float delay={0.9} style={{ position: "absolute", left: 380, top: 140 }}><Phone device="galaxy" src={a.screens[1].src} crop={a.crop} width={190} style={{ rotate: "6deg" }} /></Float>
        <Float style={{ position: "absolute", left: 198, top: 70 }}><Phone device="iphone" src={a.screens[0].src} crop={a.crop} width={224} /></Float>
      </div></Fit></Reveal>
    </Section>
    <Section as="div" style={{ background: c.darkBg, color: c.darkTitle }}><div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
      {smmCase.meta.map(([k, v], i) => <Reveal key={k} delay={i * 0.06} style={{ display: "flex", flexDirection: "column", gap: 8 }}><Eyebrow color="#8C8C8C" style={{ fontSize: 10 }}>{k}</Eyebrow><span style={{ font: "600 clamp(15px, 1.6vw, 17px)/1.3 var(--font-sora), sans-serif" }}>{v}</span></Reveal>)}
    </div></Section>
    <div className="container flex flex-col gap-20 py-20 md:gap-28 md:py-28">
      {smmCase.rows.map((r, i) => (
        <Section as="div" key={r.n} className="gap-10 md:gap-18" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", alignItems: "center" }}>
          <Reveal className={i % 2 ? "md:order-2" : undefined} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span style={{ font: "800 clamp(84px, 10vw, 120px)/0.8 var(--font-sora), sans-serif", letterSpacing: "-0.06em", color: "transparent", WebkitTextStroke: "2px #1CCBFF", filter: "drop-shadow(0 0 6px rgba(28,203,255,.6))" }}>{r.n}</span>
            <h2 style={{ margin: 0, font: "800 clamp(32px, 4vw, 44px)/1.02 var(--font-sora), sans-serif", letterSpacing: "-0.035em" }}>{r.title}</h2>
            <p style={{ margin: 0, maxWidth: 460, font: "400 clamp(16px, 1.5vw, 17px)/1.6 var(--font-sora), sans-serif", color: c.steel }}>{r.body}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{r.points.map((p) => <span key={p} style={{ display: "flex", alignItems: "center", gap: 12, font: "500 15px/1.4 var(--font-sora), sans-serif" }}><Dot />{p}</span>)}</div>
          </Reveal>
          <Reveal delay={0.1} className={i % 2 ? "md:order-1" : undefined}><HoverLift lift={4} className="h-[440px] md:h-[620px]" style={{ position: "relative", borderRadius: 32, background: r.bg, display: "grid", placeItems: "center", overflow: "hidden" }}><Float amount={8} delay={i * 0.4}><Phone device="galaxy" src={a.screens[r.screen].src} crop={a.crop} width={260} className="origin-center scale-[.68] md:scale-100" /></Float></HoverLift></Reveal>
        </Section>
      ))}
    </div>
    <Section className="px-3 pb-3 sm:px-5 sm:pb-5">
      <NeonPanel style={{ maxWidth: 1280, margin: "0 auto" }} scrim="rgba(26,43,255,.86)">
        <div style={{ padding: "clamp(36px, 6vw, 80px) clamp(28px, 6vw, 80px)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}><Eyebrow color="#FFF">Want one for your shop?</Eyebrow><h2 style={{ margin: 0, font: "800 clamp(34px, 4.4vw, 54px)/1 var(--font-sora), sans-serif", letterSpacing: "-0.04em" }}>$100 for the first 5 businesses.</h2><span style={{ font: "400 16px/1.5 var(--font-sora), sans-serif" }}>Up to 15 screens, 2 revisions, live in 10 days. No hidden costs.</span></div>
          <Button variant="onBlue" href="/claim" dot size="lg">Claim your spot</Button>
        </div>
      </NeonPanel>
    </Section>
  </>);
}
