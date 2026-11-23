"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/tokens";

/** Re-mounts on every navigation, so each page fades and rises in. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div initial={{ opacity: 0, y: 18, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }} transition={{ duration: 0.55, ease }}>
      {children}
    </motion.div>
  );
}
