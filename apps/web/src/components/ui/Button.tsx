"use client";
import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";
import { c, gradientShort, glowRing } from "@/lib/tokens";
import { Dot } from "@/components/brand/Neon";

/** Internal routes are type-checked (typedRoutes); external links, "#" anchors and mailto/tel render a plain <a>. */
export type Href = Route | `http${string}` | `mailto:${string}` | `tel:${string}` | `#${string}`;
const isInternal = (href: Href): href is Route => href.startsWith("/");

type Variant = "primary" | "neon" | "secondary" | "onBlue" | "ring";
type Props = { variant?: Variant; href?: Href; onClick?: () => void; children: React.ReactNode; dot?: boolean; disabled?: boolean; size?: "md" | "lg"; full?: boolean; type?: "button" | "submit" };

const base = (size: "md" | "lg", full?: boolean): React.CSSProperties => ({ display: full ? "flex" : "inline-flex", justifyContent: "center", alignItems: "center", gap: 10, padding: size === "lg" ? "16px 26px" : "13px 20px", borderRadius: 999, font: `600 ${size === "lg" ? 15 : 14}px/1 var(--font-sora), sans-serif`, cursor: "pointer", border: "none", whiteSpace: "nowrap", width: full ? "100%" : undefined });

const styles: Record<Variant, { rest: React.CSSProperties; hover: Record<string, string> }> = {
  primary: { rest: { background: c.ink, color: "#FFF" }, hover: { background: c.ink2, boxShadow: glowRing } },
  neon: { rest: { background: gradientShort, color: "#FFF" }, hover: { boxShadow: "0 0 18px rgba(28,203,255,.65)" } },
  secondary: { rest: { background: "transparent", color: c.ink, boxShadow: `inset 0 0 0 1.5px ${c.line}` }, hover: { boxShadow: `inset 0 0 0 1.5px ${c.blue}`, color: c.blue } },
  onBlue: { rest: { background: "#FFF", color: c.ink }, hover: { boxShadow: "0 0 0 3px rgba(28,203,255,.6), 0 0 18px rgba(28,203,255,.8)" } },
  ring: { rest: { border: "2px solid transparent", background: `linear-gradient(${c.ink}, ${c.ink}) padding-box, linear-gradient(90deg, #1A2BFF, #0A7BFF 45%, #1CCBFF) border-box`, color: "#FFF" }, hover: { boxShadow: "0 0 18px rgba(28,203,255,.55)" } },
};

export function Button({ variant = "primary", href, onClick, children, dot, disabled, size = "md", full, type = "button" }: Props) {
  const v = styles[variant];
  const style = { ...base(size, full), ...v.rest, ...(disabled ? { background: "#E6E6E6", color: c.ash, boxShadow: "none", cursor: "not-allowed" } : {}) };
  const inner = <>{dot && <Dot color={disabled ? "#B4B9C0" : variant === "onBlue" ? c.blue : c.cyan} />}{children}</>;
  const motionProps = disabled ? {} : { whileHover: { ...v.hover, y: -2 }, whileTap: { scale: 0.96, y: 0 }, whileFocus: { boxShadow: glowRing }, transition: { type: "spring" as const, stiffness: 420, damping: 26 } };
  if (href && !disabled) return <motion.span style={{ display: full ? "block" : "inline-block", borderRadius: 999 }} {...motionProps}>{isInternal(href) ? <Link href={href} style={{ ...style, display: "flex" }}>{inner}</Link> : <a href={href} style={{ ...style, display: "flex" }} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inner}</a>}</motion.span>;
  return <motion.button type={type} disabled={disabled} onClick={onClick} style={style} {...motionProps}>{inner}</motion.button>;
}

export function TextLink({ href, children }: { href: Route; children: React.ReactNode }) {
  return <motion.span initial="rest" whileHover="hover" animate="rest" style={{ display: "inline-flex" }}><Link href={href} style={{ font: "600 14px/1 var(--font-sora), sans-serif", display: "inline-flex", gap: 6 }}>{children} <motion.span variants={{ rest: { x: 0 }, hover: { x: 4 } }}>→</motion.span></Link></motion.span>;
}
