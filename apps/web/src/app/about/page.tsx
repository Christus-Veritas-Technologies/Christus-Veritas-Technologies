import { CVTMark } from "@/components/brand/CVTMark";
import { Eyebrow } from "@/components/brand/Neon";
import { Reveal } from "@/components/ui/Reveal";
import { HoverLift, Section } from "@/components/ui/Motion";
import { FinalCTA } from "@/components/site/Sections";
import { values } from "@/content/site";
import { c } from "@/lib/tokens";

export const metadata = { title: "About · CVT" };
const word: React.CSSProperties = { font: "800 clamp(24px, 6.4vw, 64px)/1 var(--font-montserrat), sans-serif", letterSpacing: ".01em" };
const mean: React.CSSProperties = { font: "500 clamp(10px, 1.4vw, 12px)/1 var(--font-mono), monospace", letterSpacing: ".16em", color: c.blue };

export default function About() {
  return (<>
    <Section className="px-5 pt-12 pb-20 md:px-7 md:pt-18 md:pb-30" style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 28 }}>
      <div style={{ position: "absolute", left: "50%", top: 20, width: 760, height: 760, marginLeft: -380, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(10,123,255,.14), rgba(10,123,255,0))" }} />
      <div className="w-[180px] md:w-[260px]" style={{ position: "relative" }}><CVTMark size={260} style={{ width: "100%", height: "auto" }} /></div>
      <Reveal className="gap-x-4 gap-y-1.5 md:gap-x-10" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(2, auto)", alignItems: "baseline", justifyContent: "center" }}>
        <span style={{ ...word, textAlign: "right" }}>CHRISTUS</span><span style={{ ...word, textAlign: "left" }}>VERITAS</span>
        <span style={{ ...mean, textAlign: "right" }}>CHRIST</span><span style={{ ...mean, textAlign: "left" }}>IS TRUTH</span>
      </Reveal>
      <Reveal delay={0.12}><p style={{ position: "relative", margin: 0, maxWidth: 640, font: "400 clamp(16px, 1.8vw, 19px)/1.6 var(--font-sora), sans-serif", color: c.steel }}>Our name is Latin for "Christ is Truth". Faith is our foundation. The work is modern software, built in Mutare for African businesses.</p></Reveal>
    </Section>
    <Section className="container grid grid-cols-1 pb-20 md:grid-cols-3 md:pb-28" style={{ borderTop: `1px solid ${c.mist}` }}>
      {values.map((v, i) => (
        <Reveal key={v.n} delay={i * 0.08} className={i < values.length - 1 ? "md:border-r md:border-mist" : undefined}><HoverLift lift={4} className="px-1 pt-10 md:px-8" style={{ display: "flex", flexDirection: "column", gap: 14, borderRadius: 20, paddingBottom: 8 }}>
          <span style={{ font: "500 10.5px/1 var(--font-mono), monospace", letterSpacing: ".14em", color: c.cyan }}>{v.n}</span>
          <span style={{ font: "800 clamp(26px, 2.6vw, 30px)/1.05 var(--font-sora), sans-serif", letterSpacing: "-0.03em" }}>{v.title}</span>
          <span style={{ font: "400 15px/1.6 var(--font-sora), sans-serif", color: c.steel }}>{v.body}</span>
        </HoverLift></Reveal>
      ))}
    </Section>
    <Section style={{ background: c.darkBg, color: c.darkTitle }}><div className="container py-16 md:py-26" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 48, alignItems: "center" }}>
      <Reveal style={{ display: "flex", flexDirection: "column", gap: 20 }}><Eyebrow color="#8C8C8C">Lean by design</Eyebrow><h2 style={{ margin: 0, font: "800 clamp(34px, 4.4vw, 54px)/1 var(--font-sora), sans-serif", letterSpacing: "-0.04em" }}>An agency, not a corporate firm.</h2><p style={{ margin: 0, maxWidth: 480, font: "400 16px/1.65 var(--font-sora), sans-serif", color: c.darkBody }}>A small, fast team means less overhead, quicker decisions and prices local businesses can afford, without cutting corners on design or code.</p></Reveal>
      {/* TODO: replace with a real team photo, e.g. <Image src="/team.jpg" fill alt="The CVT team" /> */}
      <Reveal delay={0.12}><div className="h-[300px] md:h-[440px]" style={{ borderRadius: 28, background: "#1F1F1F", border: "1.5px dashed #3A3F3F", display: "grid", placeItems: "center", font: "500 11px/1 var(--font-mono), monospace", letterSpacing: ".12em", color: "#8C8C8C" }}>TEAM PHOTO</div></Reveal>
    </div></Section>
    <FinalCTA title="Let's build" accent="something true." body="Tell us what you need. If it's the $100 offer, claim a spot before the 5 are gone." />
  </>);
}
