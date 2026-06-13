import React from "react";
import { FadeUp } from "@/components/Animate";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  dark?: boolean;
}

export default function SectionHeader({ eyebrow, title, subtitle, align = "center", className, dark = false }: SectionHeaderProps) {
  return (
    <FadeUp className={cn(align === "center" ? "text-center" : "text-left", "mb-14", className)}>
      <p className={cn(
        "text-[0.68rem] font-[family-name:var(--font-barlow)] font-bold uppercase tracking-[0.22em] mb-3",
        dark ? "text-[var(--accent)]" : "text-[var(--accent)]"
      )}>
        {eyebrow}
      </p>
      <h2 className={cn(
        "font-[family-name:var(--font-playfair)] font-medium leading-[1.12]",
        "text-[clamp(1.85rem,4vw,2.9rem)]",
        dark ? "text-white" : "text-[var(--text-primary)]"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "mt-4 text-base font-light max-w-xl leading-relaxed",
          align === "center" && "mx-auto",
          dark ? "text-white/60" : "text-[var(--text-secondary)]"
        )}>
          {subtitle}
        </p>
      )}
      <div className={cn("h-0.5 w-10 bg-[var(--accent)] rounded-full mt-5", align === "center" && "mx-auto")} />
    </FadeUp>
  );
}
