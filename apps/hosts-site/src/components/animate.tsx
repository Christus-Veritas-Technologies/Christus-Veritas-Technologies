"use client";

import { motion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Variants ──────────────────────────────────────────────────────────────────

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0 },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1 },
};

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  show:   { opacity: 1, scale: 1,    y: 0  },
};

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -32 },
  show:   { opacity: 1, x: 0   },
};

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  show:   { opacity: 1, x: 0  },
};

const staggerContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

// ── Shared viewport config ────────────────────────────────────────────────────
const VP = { once: true, margin: "-60px 0px" } as const;

// ── Component factory ─────────────────────────────────────────────────────────
interface AnimProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function FadeUp({ children, delay = 0, duration = 0.55, className = "", style }: AnimProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="show"
      viewport={VP}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, duration = 0.6, className = "", style }: AnimProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      whileInView="show"
      viewport={VP}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, duration = 0.5, className = "", style }: AnimProps) {
  return (
    <motion.div
      variants={scaleInVariants}
      initial="hidden"
      whileInView="show"
      viewport={VP}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function SlideLeft({ children, delay = 0, duration = 0.55, className = "", style }: AnimProps) {
  return (
    <motion.div
      variants={slideLeftVariants}
      initial="hidden"
      whileInView="show"
      viewport={VP}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function SlideRight({ children, delay = 0, duration = 0.55, className = "", style }: AnimProps) {
  return (
    <motion.div
      variants={slideRightVariants}
      initial="hidden"
      whileInView="show"
      viewport={VP}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/** Wrap a grid/list — children animate in with stagger when parent enters viewport */
export function StaggerGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={VP}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/** Child of StaggerGrid — inherits stagger timing automatically */
export function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={scaleInVariants} transition={{ duration: 0.45, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}
