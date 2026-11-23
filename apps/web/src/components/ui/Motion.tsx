"use client";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { ease } from "@/lib/tokens";

type SectionProps = {
  children: React.ReactNode;
  as?: "section" | "div";
  id?: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Scroll-linked section. Rises and fades in as it enters the viewport and eases back
 * out as it leaves the top, in both scroll directions. Static when reduced motion is on.
 */
export function Section({ children, as = "section", id, className, style }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 0.7"] });
  const { scrollYProgress: leave } = useScroll({ target: ref, offset: ["end 0.3", "end start"] });
  const opacity = useTransform([enter, leave], ([a, b]: number[]) => Math.min(a, 1 - b * 0.85));
  const y = useTransform([enter, leave], ([a, b]: number[]) => (1 - a) * 64 - b * 48);
  const scale = useTransform([enter, leave], ([a, b]: number[]) => 0.965 + 0.035 * Math.min(a, 1 - b));
  const motionStyle: MotionStyle = reduce ? style ?? {} : { ...style, opacity, y, scale };
  const Tag = as === "div" ? motion.div : motion.section;
  return (
    <Tag ref={ref as never} id={id} className={className} style={motionStyle}>
      {children}
    </Tag>
  );
}

/** Lifts on hover and dips slightly on press. For cards and tiles. */
export function HoverLift({ children, className, style, lift = 6 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; lift?: number }) {
  return (
    <motion.div
      className={className}
      style={style}
      whileHover={{ y: -lift, boxShadow: "0 0 0 2px rgba(28,203,255,.35), 0 24px 48px -24px rgba(10,123,255,.45)" }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.25, ease }}
    >
      {children}
    </motion.div>
  );
}

const MLink = motion.create(Link);

/** Next link that nudges right and tints on hover. */
export function NudgeLink({ href, children, className, style, nudge = 4, color = "#0A7BFF" }: { href: React.ComponentProps<typeof Link>["href"]; children: React.ReactNode; className?: string; style?: React.CSSProperties; nudge?: number; color?: string }) {
  return (
    <MLink href={href} className={className} style={style} whileHover={{ x: nudge, color }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
      {children}
    </MLink>
  );
}

/**
 * Renders children at a fixed design size and scales the whole group down to fit
 * the available width. Used for the absolutely-positioned phone clusters.
 */
export function Fit({ width, height, children, className, style }: { width: number; height: number; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / width));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  const s = scale ?? 1;
  return (
    <div ref={ref} className={className} style={{ position: "relative", width: "100%", maxWidth: width, height: height * s, ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, width, height, transform: `scale(${s})`, transformOrigin: "top left", opacity: scale == null ? 0 : 1, transition: "opacity .35s" }}>
        {children}
      </div>
    </div>
  );
}
