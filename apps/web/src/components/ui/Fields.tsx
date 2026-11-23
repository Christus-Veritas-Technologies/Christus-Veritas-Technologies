"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { c, ease, focusRing } from "@/lib/tokens";

const label: React.CSSProperties = { font: "600 14px/1.3 var(--font-sora), sans-serif" };
const box: React.CSSProperties = { borderWidth: 1.5, borderStyle: "solid", borderRadius: 14, font: "400 16px/1.5 var(--font-sora), sans-serif", color: c.ink, outline: "none", width: "100%", background: "#FFF" };
const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

/** Shared focus/hover animation for inputs and text areas. */
function useFieldMotion(error?: string) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const borderColor = error ? c.error : focused ? c.cyan : filled ? c.ink : c.line;
  return {
    focused,
    animate: { borderColor, boxShadow: focused ? focusRing : "0 0 0 0 rgba(28,203,255,0)", y: focused ? -1 : 0 },
    whileHover: focused ? undefined : { borderColor: error ? c.error : c.ash },
    transition: spring,
    bind: (onFocus?: React.FocusEventHandler<HTMLInputElement & HTMLTextAreaElement>, onBlur?: React.FocusEventHandler<HTMLInputElement & HTMLTextAreaElement>) => ({
      onFocus: (e: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => { setFocused(true); onFocus?.(e); },
      onBlur: (e: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => { setFocused(false); setFilled(!!e.currentTarget.value); onBlur?.(e); },
    }),
  };
}

function FieldLabel({ text, focused }: { text: string; focused: boolean }) {
  return <motion.span animate={{ color: focused ? c.blue : c.ink, x: focused ? 2 : 0 }} transition={spring} style={label}>{text}</motion.span>;
}

function FieldError({ error }: { error?: string }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.span initial={{ opacity: 0, y: -4, x: 0 }} animate={{ opacity: 1, y: 0, x: [0, -6, 6, -3, 3, 0] }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.4 }}
          style={{ font: "500 12.5px/1.3 var(--font-sora), sans-serif", color: "#C4332F" }}>{error}</motion.span>
      )}
    </AnimatePresence>
  );
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd" | "style"> & { label: string; error?: string };

export function Input({ label: l, error, onFocus, onBlur, ...p }: InputProps) {
  const f = useFieldMotion(error);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <FieldLabel text={l} focused={f.focused} />
      <motion.input {...p} {...f.bind(onFocus as never, onBlur as never)} initial={false} animate={f.animate} whileHover={f.whileHover} transition={f.transition} style={{ ...box, height: 54, padding: "0 16px" }} />
      <FieldError error={error} />
    </label>
  );
}

type AreaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd" | "style"> & { label: string; error?: string };

export function TextArea({ label: l, error, onFocus, onBlur, ...p }: AreaProps) {
  const f = useFieldMotion(error);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <FieldLabel text={l} focused={f.focused} />
      <motion.textarea rows={5} {...p} {...f.bind(onFocus as never, onBlur as never)} initial={false} animate={f.animate} whileHover={f.whileHover} transition={f.transition} style={{ ...box, padding: "14px 16px", resize: "vertical" }} />
      <FieldError error={error} />
    </label>
  );
}

export function ChoiceCards({ label: l, options, value, onChange, columns = 2 }: { label: string; options: string[]; value?: string; onChange: (v: string) => void; columns?: number }) {
  return (
    <fieldset style={{ border: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
      <legend style={{ ...label, marginBottom: 10 }}>{l}</legend>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${columns === 1 ? 400 : 220}px), 1fr))`, gap: 10 }}>
        {options.map((o) => {
          const on = value === o;
          return (
            <motion.button type="button" key={o} onClick={() => onChange(o)} aria-pressed={on}
              initial={false}
              animate={{ borderColor: on ? c.blue : c.line, backgroundColor: on ? c.tint : "#FFFFFF", boxShadow: on ? "0 0 0 3px rgba(28,203,255,.15)" : "0 0 0 0 rgba(28,203,255,0)" }}
              whileHover={on ? { y: -2 } : { y: -2, borderColor: c.ash }} whileTap={{ scale: 0.98 }} transition={spring}
              style={{ textAlign: "left", cursor: "pointer", padding: 16, borderRadius: 14, borderWidth: 1.5, borderStyle: "solid", display: "flex", alignItems: "center", gap: 12, font: "600 14px/1.3 var(--font-sora), sans-serif", color: c.ink }}>
              <motion.span initial={false} animate={{ borderWidth: on ? 5 : 1.5, borderColor: on ? c.blue : "#B4B9C0", scale: on ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }} style={{ width: 18, height: 18, borderRadius: "50%", borderStyle: "solid", background: "#FFF", flex: "none", boxSizing: "border-box" }} />
              {o}
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Chips({ label: l, options, value, onChange }: { label: string; options: string[]; value?: string; onChange: (v: string) => void }) {
  return (
    <fieldset style={{ border: "none", padding: 0, margin: 0, minWidth: 0 }}>
      <legend style={{ ...label, marginBottom: 10 }}>{l}</legend>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((o) => {
          const on = value === o;
          return (
            <motion.button type="button" key={o} onClick={() => onChange(o)} aria-pressed={on} layout
              initial={false}
              animate={{ borderColor: on ? c.ink : c.line, backgroundColor: on ? c.ink : "#FFFFFF", color: on ? "#FFFFFF" : c.ink }}
              whileHover={{ y: -2, borderColor: on ? c.ink : c.ash }} whileTap={{ scale: 0.95 }} transition={spring}
              style={{ cursor: "pointer", padding: "11px 15px", borderRadius: 999, borderWidth: 1.5, borderStyle: "solid", font: "600 13.5px/1 var(--font-sora), sans-serif", display: "flex", alignItems: "center", gap: 7 }}>
              <AnimatePresence initial={false}>
                {on && <motion.span initial={{ scale: 0, width: 0 }} animate={{ scale: 1, width: 6 }} exit={{ scale: 0, width: 0 }} style={{ height: 6, borderRadius: "50%", background: c.cyan, boxShadow: "0 0 6px #1CCBFF" }} />}
              </AnimatePresence>
              {o}
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}
