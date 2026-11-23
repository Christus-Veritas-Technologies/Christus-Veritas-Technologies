import type { Route } from "next";
import { CVTMark } from "@/components/brand/CVTMark";
import { NudgeLink } from "@/components/ui/Motion";
import { Reveal } from "@/components/ui/Reveal";
import { company } from "@/content/site";

const mono: React.CSSProperties = { font: "500 10.5px/1 var(--font-mono), monospace", letterSpacing: ".12em", color: "#8C8C8C", textTransform: "uppercase" };
const col: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, font: "400 14px/1.4 var(--font-sora), sans-serif" };
const siteLinks: { href: Route; label: string }[] = [{ href: "/", label: "Home" }, { href: "/work", label: "Work" }, { href: "/services", label: "Services" }, { href: "/about", label: "About" }, { href: "/claim", label: "Claim a $100 app" }];

export function Footer() {
  return (
    <footer style={{ background: "#101212", color: "#DFE0E2", marginTop: 20 }}>
      <div className="container pt-14 pb-10 md:pt-18" style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal className="sm:col-span-2" style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <CVTMark size={56} ridgeColor="#FFFFFF" animate={false} />
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}><span style={{ font: "800 15px/1 var(--font-montserrat), sans-serif" }}>CHRISTUS VERITAS</span><span style={{ font: "400 6.6px/1 var(--font-montserrat), sans-serif", letterSpacing: ".42em", color: "#A0A0A0" }}>TECHNOLOGIES</span></div>
            </div>
            <p style={{ margin: 0, maxWidth: 340, font: "400 14px/1.6 var(--font-sora), sans-serif", color: "#A0A0A0" }}>{company.bio}</p>
          </Reveal>
          <Reveal delay={0.06} style={col}>
            <span style={{ ...mono, marginBottom: 6 }}>Site</span>
            {siteLinks.map((l) => <NudgeLink key={l.href} href={l.href} color="#1CCBFF">{l.label}</NudgeLink>)}
          </Reveal>
          <Reveal delay={0.12} style={col}>
            <span style={{ ...mono, marginBottom: 6 }}>Contact</span>
            <span>{company.location}</span>
            <span>{company.website}</span>
            <a href={company.whatsapp ? `https://wa.me/${company.whatsapp}` : "#"} style={{ color: "#1CCBFF" }}>Chat on WhatsApp →</a>
          </Reveal>
        </div>
        <div style={{ ...mono, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingTop: 24, borderTop: "1px solid #232727" }}><span>© {new Date().getFullYear()} Christus Veritas Technologies</span><span>{company.meaning}</span></div>
      </div>
    </footer>
  );
}
