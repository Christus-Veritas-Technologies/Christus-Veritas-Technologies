"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { claimSteps, company } from "@/content/site";
import { Input, TextArea, ChoiceCards, Chips } from "@/components/ui/Fields";
import { Button } from "@/components/ui/Button";
import { CVTMark } from "@/components/brand/CVTMark";
import { c } from "@/lib/tokens";
import { claimSchema, fieldErrors } from "@/lib/validation";

type Result = { ok: boolean; errors?: Record<string, string> };

async function postClaim(data: Record<string, string>): Promise<Result> {
  try {
    const res = await fetch("/api/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    return (await res.json()) as Result;
  } catch {
    return { ok: false, errors: { form: "No connection. Check your internet and try again." } };
  }
}

/** 4-step application. Validates each step, then saves every answer through /api/claim (or a custom onSubmit). */
export function ClaimForm({ onSubmit = postClaim }: { onSubmit?: (data: Record<string, string>) => Promise<Result> }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const set = (k: string, v: string) => { setData((d) => ({ ...d, [k]: v })); setErrors((e) => { if (!e[k]) return e; const { [k]: _, ...rest } = e; return rest; }); };
  const done = step >= claimSteps.length;
  const cur = claimSteps[Math.min(step, claimSteps.length - 1)];
  /** Errors for the given steps' fields only, so later steps never block earlier ones. */
  const errorsFor = (steps: number[]) => {
    const parsed = claimSchema.safeParse(data);
    if (parsed.success) return {};
    const keys = new Set(steps.flatMap((i) => claimSteps[i].fields.map((f) => f.key)));
    return Object.fromEntries(Object.entries(fieldErrors(parsed.error)).filter(([k]) => keys.has(k)));
  };
  const next = async () => {
    const stepErrors = errorsFor([step]);
    if (Object.keys(stepErrors).length) { setErrors(stepErrors); return; }
    if (step < claimSteps.length - 1) { setStep((s) => s + 1); return; }
    setSending(true);
    const res = await onSubmit(data);
    setSending(false);
    if (res.ok) { setErrors({}); setStep((s) => s + 1); return; }
    const errs = res.errors ?? {};
    setErrors(errs);
    // Jump back to the first step that has a field error.
    const bad = claimSteps.findIndex((st) => st.fields.some((f) => errs[f.key]));
    if (bad >= 0) setStep(bad);
    toast.error(errs.form ?? "Please check the highlighted answers.");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {claimSteps.map((_, i) => <motion.span key={i} animate={{ background: i < step || done ? c.blue : i === step ? c.cyan : c.mist, boxShadow: i === step && !done ? "0 0 8px #1CCBFF" : "0 0 0 #0000" }} style={{ flex: 1, height: 6, borderRadius: 3 }} />)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", font: "500 10.5px/1 var(--font-mono), monospace", letterSpacing: ".12em", color: c.steel }}><span>{done ? "SUBMITTED" : `STEP ${step + 1} OF ${claimSteps.length} · ${cur.title.toUpperCase()}`}</span><span>ABOUT 3 MINUTES</span></div>
      </div>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22, paddingTop: 24 }}>
            <CVTMark size={120} />
            <h2 style={{ margin: 0, font: "800 clamp(34px, 4.5vw, 48px)/1 var(--font-sora), sans-serif", letterSpacing: "-0.04em" }}>Thanks. We're reviewing your idea.</h2>
            <p style={{ margin: 0, maxWidth: 520, font: "400 17px/1.6 var(--font-sora), sans-serif", color: c.steel }}>If your project is a fit, we'll message you on WhatsApp to book a short call and start your designs.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Button href={company.whatsapp ? `https://wa.me/${company.whatsapp}` : "#"} dot size="lg">Chat on WhatsApp</Button><Button variant="secondary" size="lg" onClick={() => { setStep(0); setData({}); setErrors({}); }}>Start again</Button></div>
          </motion.div>
        ) : (
          <motion.div key={step} initial="hidden" animate="show" exit={{ opacity: 0, x: -32, transition: { duration: 0.2 } }} variants={{ hidden: { opacity: 0, x: 32 }, show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1], staggerChildren: 0.05 } } }} style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><h2 style={{ margin: 0, font: "800 clamp(30px, 3.6vw, 38px)/1.05 var(--font-sora), sans-serif", letterSpacing: "-0.035em" }}>{cur.title}</h2><p style={{ margin: 0, font: "400 15px/1.55 var(--font-sora), sans-serif", color: c.steel }}>{cur.hint}</p></div>
            {cur.fields.map((f) => <motion.div key={f.key} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>{
              f.kind === "input" ? <Input key={f.key} label={f.label} placeholder={f.ph} type={f.type} value={data[f.key] ?? ""} error={errors[f.key]} onChange={(e) => set(f.key, e.target.value)} />
              : f.kind === "area" ? <TextArea key={f.key} label={f.label} placeholder={f.ph} value={data[f.key] ?? ""} error={errors[f.key]} onChange={(e) => set(f.key, e.target.value)} />
              : f.kind === "cards" ? <ChoiceCards key={f.key} label={f.label} options={f.options} value={data[f.key]} onChange={(v) => set(f.key, v)} />
              : <Chips key={f.key} label={f.label} options={f.options} value={data[f.key]} onChange={(v) => set(f.key, v)} />
            }</motion.div>)}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, paddingTop: 12, borderTop: `1px solid ${c.mist}` }}>
              <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
              <Button dot size="lg" onClick={next} disabled={sending}>{sending ? "Sending…" : step === claimSteps.length - 1 ? "Submit application" : "Continue"}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
