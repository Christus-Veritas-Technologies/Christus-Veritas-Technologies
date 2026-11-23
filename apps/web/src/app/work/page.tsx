import { Suspense } from "react";
import { WorkGrid } from "@/components/site/WorkGrid";
import { Eyebrow } from "@/components/brand/Neon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Motion";
import { apps, clientSystems } from "@/content/site";
import { c } from "@/lib/tokens";

export const metadata = { title: "Work · CVT", description: "Real apps, real screens. Products we run and systems we built for clients." };

export default function Work() {
  const total = String(apps.length + clientSystems.length).padStart(2, "0");
  return (<>
    <Section className="container pt-10 pb-10 md:pt-16" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 48, alignItems: "end" }}>
      <Reveal style={{ display: "flex", flexDirection: "column", gap: 18 }}><Eyebrow>Our work</Eyebrow><h1 style={{ margin: 0, font: "800 clamp(44px, 7vw, 88px)/0.95 var(--font-sora), sans-serif", letterSpacing: "-0.05em" }}>Real apps.<br /><span className="grad-text">Real screens.</span></h1></Reveal>
      <Reveal delay={0.12} className="justify-start md:justify-end" style={{ display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 180, height: 180, flex: "none" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundImage: "url(/brand/icon-pattern.svg), linear-gradient(to top,#1A2BFF,#0A7BFF 55%,#1CCBFF)", backgroundSize: "70px auto, 100% 100%" }} />
          <div style={{ position: "absolute", inset: -8, border: "2.4px solid #1CCBFF", borderRadius: "50%", boxShadow: "0 0 8px rgba(28,203,255,.8)" }} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#FFF", textAlign: "center" }}><div><div style={{ font: "800 64px/1 var(--font-sora), sans-serif", letterSpacing: "-0.04em" }}>{total}</div><div style={{ font: "500 9px/1 var(--font-mono), monospace", letterSpacing: ".14em", marginTop: 6 }}>PROJECTS</div></div></div>
        </div>
        <p style={{ margin: 0, maxWidth: 260, font: "400 15px/1.6 var(--font-sora), sans-serif", color: c.steel }}>Products we run ourselves and systems we built for clients. Every screen shown is real.</p>
      </Reveal>
    </Section>
    <Section as="div"><Suspense><WorkGrid /></Suspense></Section>
  </>);
}
