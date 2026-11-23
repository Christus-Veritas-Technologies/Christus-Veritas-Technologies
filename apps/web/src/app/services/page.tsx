import { ServiceSelector } from "@/components/site/ServiceSelector";
import { ContactDrawer } from "@/components/site/ContactDrawer";
import { Eyebrow } from "@/components/brand/Neon";
import { Reveal } from "@/components/ui/Reveal";
import { HoverLift, Section } from "@/components/ui/Motion";
import { promises } from "@/content/site";
import { c } from "@/lib/tokens";

export const metadata = { title: "Services · CVT" };

export default function Services() {
  return (<>
    <Section className="container pt-10 pb-10 md:pt-16 md:pb-14" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
      <Reveal style={{ display: "flex", flexDirection: "column", gap: 18 }}><Eyebrow>Services</Eyebrow><h1 style={{ margin: 0, font: "800 clamp(42px, 7vw, 88px)/0.95 var(--font-sora), sans-serif", letterSpacing: "-0.05em" }}>Software that<br /><span className="grad-text">pays for itself.</span></h1></Reveal>
      <Reveal delay={0.12} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20, maxWidth: 340 }}><p style={{ margin: 0, font: "400 16px/1.6 var(--font-sora), sans-serif", color: c.steel }}>Four things we build, each judged by one question: does it make or save your business money?</p><ContactDrawer /></Reveal>
    </Section>
    <Section as="div"><ServiceSelector /></Section>
    <Section style={{ background: c.surface }}><div className="container py-16 md:py-24" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 24 }}>
      {promises.map((p, i) => (
        <Reveal key={p.title} delay={i * 0.08}><HoverLift className="p-6 md:p-8" style={{ height: "100%", background: "#FFF", borderRadius: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <span className="grad-text" style={{ font: "800 54px/0.9 var(--font-sora), sans-serif", letterSpacing: "-0.05em" }}>{p.big}</span>
          <span style={{ font: "700 19px/1.25 var(--font-sora), sans-serif" }}>{p.title}</span>
          <span style={{ font: "400 14.5px/1.55 var(--font-sora), sans-serif", color: c.steel }}>{p.body}</span>
        </HoverLift></Reveal>
      ))}
    </div></Section>
  </>);
}
