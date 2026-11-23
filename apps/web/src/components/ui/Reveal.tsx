"use client";
import { motion } from "framer-motion";
import { ease } from "@/lib/tokens";

/** Fades + lifts children in when scrolled into view, and back out when scrolled away. */
export function Reveal({ children, delay = 0, y = 24, style, className }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/** Gentle float loop for hero devices. */
export function Float({ children, delay = 0, amount = 10, style, className }: { children: React.ReactNode; delay?: number; amount?: number; style?: React.CSSProperties; className?: string }) {
  return <motion.div className={className} animate={{ y: [0, -amount, 0] }} transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }} style={style}>{children}</motion.div>;
}
