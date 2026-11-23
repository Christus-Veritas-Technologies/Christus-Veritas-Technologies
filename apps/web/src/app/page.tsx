import Link from "next/link";
import { Phone } from "@/components/devices/Phone";
import { NeonDisc, Eyebrow } from "@/components/brand/Neon";
import { CVTMark } from "@/components/brand/CVTMark";
import { Button } from "@/components/ui/Button";
import { SpotTracker, Price } from "@/components/ui/Offer";
import { Reveal, Float } from "@/components/ui/Reveal";
import { Fit, HoverLift, NudgeLink, Section } from "@/components/ui/Motion";
import { Accordion } from "@/components/ui/Accordion";
import { OfferSection, HowItWorks, FinalCTA, SectionHead } from "@/components/site/Sections";
import { apps, services, faqs, offer, company } from "@/content/site";
import { c } from "@/lib/tokens";

const app = (s: string) => apps.find((a) => a.slug === s)!;

export default function Home() {
  const pos = app("smm-pos"), dv = app("designvantage"), iron = app("iron-sets");
  return (<>
    <Section className="container py-8 md:pt-12 md:pb-10" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))", gap: 40, alignItems: "center" }}>
      <Reveal style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "8px 14px", border: "1.5px solid #1CCBFF", borderRadius: 999, boxShadow: "0 0 10px rgba(28,203,255,.35)" }}><Eyebrow color={c.ink} style={{ fontSize: 10.5, letterSpacing: ".12em" }}>First 5 businesses · $100 apps</Eyebrow><SpotTracker left={offer.spotsLeft} size={8} label={false} /></div>
        <h1 style={{ margin: 0, font: "800 clamp(40px, 6.4vw, 84px)/0.98 var(--font-sora), sans-serif", letterSpacing: "-0.045em" }}>Look like the biggest business <span className="grad-text">in town.</span></h1>
        <p style={{ margin: 0, maxWidth: 520, font: "400 clamp(16px, 1.6vw, 18px)/1.55 var(--font-sora), sans-serif", color: c.steel }}>Premium mobile apps, websites and POS systems, designed and built in Mutare at prices African businesses can afford.</p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}><Button href="/claim" dot size="lg">Claim a $100 app</Button><Button href="/work" variant="secondary" size="lg">See what we've built</Button></div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", paddingTop: 8 }}><Price big={40} /><span style={{ width: 1, height: 32, background: c.line }} /><span style={{ font: "500 10.5px/1.7 var(--font-mono), monospace", letterSpacing: ".1em" }}>UP TO 15 SCREENS · 2 REVISIONS<br />LIVE IN 10 DAYS · NO HIDDEN COSTS</span></div>
      </Reveal>
      <Reveal delay={0.15} y={40}>
        <Fit width={620} height={620} className="mx-auto">
          <div style={{ position: "relative", width: 620, height: 620 }}>
            <NeonDisc size="98%" tile={130} style={{ left: "4%", top: "2%" }} />
            <Float delay={0.4} style={{ position: "absolute", left: "5%", top: "24%" }}><Phone device="galaxy" src={pos.screens[0].src} crop={pos.crop} width={170} style={{ rotate: "-6deg" }} /></Float>
            <Float delay={0.8} style={{ position: "absolute", right: "3%", top: "24%" }}><Phone device="galaxy" src={iron.screens[0].src} crop={iron.crop} width={170} style={{ rotate: "6deg" }} /></Float>
            <Float style={{ position: "absolute", left: "50%", top: "10%", marginLeft: -100 }}><Phone device="iphone" src={dv.screens[0].src} crop={dv.crop} width={200} /></Float>
          </div>
        </Fit>
      </Reveal>
    </Section>
    <Section as="div" className="container pt-2 pb-14" style={{ display: "flex", alignItems: "center", gap: "16px 28px", flexWrap: "wrap" }}>
      <Eyebrow style={{ fontSize: 11, letterSpacing: ".12em" }}>Trusted by</Eyebrow>
      {company.clients.map((n) => <span key={n} style={{ font: "800 17px/1 var(--font-montserrat), sans-serif", letterSpacing: ".02em", textTransform: "uppercase" }}>{n}</span>)}
      <span className="hidden sm:block" style={{ flex: 1, minWidth: 40, height: 1, background: c.mist }} /><Eyebrow style={{ fontSize: 11, letterSpacing: ".12em" }}>Built in Mutare, Zimbabwe</Eyebrow>
    </Section>

    <Section className="py-16 md:py-24" style={{ background: c.surface }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
          <SectionHead eyebrow="Real apps we've built" title="Every screen here is real work." />
          <p style={{ margin: 0, maxWidth: 380, font: "400 15px/1.6 var(--font-sora), sans-serif", color: c.steel }}>Shops, creators, gyms and radio listeners use what we build. Yours gets the same care.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5" style={{ alignItems: "start" }}>
          {apps.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.06} className={i % 2 ? "lg:mt-12" : undefined}>
              <Link href={`/work?app=${a.slug}`} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <HoverLift style={{ position: "relative", aspectRatio: "3 / 4.4", borderRadius: 22, overflow: "hidden", background: a.bg }}>
                  <Fit width={220} height={323} className="mx-auto">
                    <div style={{ display: "grid", placeItems: "center", width: 220, height: 323 }}><Phone device={a.hero} src={a.screens[0].src} crop={a.crop} width={140} /></div>
                  </Fit>
                </HoverLift>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 4px" }}><Eyebrow color={c.ink} style={{ fontSize: 10.5, letterSpacing: ".12em" }}>{a.name}</Eyebrow><span style={{ font: "400 14px/1.5 var(--font-sora), sans-serif", color: c.steel }}>{a.line}</span></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>

    <OfferSection />
    <HowItWorks />

    <Section className="py-16 md:py-26" style={{ background: c.darkBg, color: c.darkTitle }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}><SectionHead light eyebrow="What we build" title="Software that pays for itself." /><CVTMark size={120} ridgeColor="#FFFFFF" /></div>
        <div>{services.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.05}>
            <NudgeLink href={`/services#${s.slug}`} nudge={8} color={c.white} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "12px 40px", padding: "30px 0", borderTop: "1px solid #232727", alignItems: "baseline" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}><span style={{ font: "500 11px/1 var(--font-mono), monospace", letterSpacing: ".12em", color: c.cyan }}>{s.n}</span><span style={{ font: "800 clamp(26px, 3vw, 36px)/1.05 var(--font-sora), sans-serif", letterSpacing: "-0.03em" }}>{s.name}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><span style={{ font: "400 16px/1.55 var(--font-sora), sans-serif", color: c.darkBody }}>{s.body}</span><span style={{ font: "500 10.5px/1.5 var(--font-mono), monospace", letterSpacing: ".08em", color: "#8C8C8C", textTransform: "uppercase" }}>{s.proof}</span></div>
            </NudgeLink>
          </Reveal>
        ))}</div>
      </div>
    </Section>

    <Section className="container py-16 md:py-26" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: 48, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}><SectionHead eyebrow="Straight answers" title="Sounds too good to be true?" /><p style={{ margin: 0, maxWidth: 380, font: "400 15px/1.6 var(--font-sora), sans-serif", color: c.steel }}>Fair question. Here's everything people ask before claiming a spot.</p></div>
      <Accordion items={faqs} />
    </Section>
    <FinalCTA />
  </>);
}
