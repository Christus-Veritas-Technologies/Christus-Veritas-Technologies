"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Drawer, CloseButton } from "@/components/ui/Overlay";
import { Input, TextArea, Chips } from "@/components/ui/Fields";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/brand/Neon";
import { company } from "@/content/site";
import { contactSchema, fieldErrors } from "@/lib/validation";

/** Trigger button + quick-contact drawer. */
export function ContactDrawer({ label = "Not sure which? Talk to us →" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const [need, setNeed] = useState("Mobile app");
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: "" })); };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { interest: need, ...form };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) { setErrors(fieldErrors(parsed.error)); return; }
    setSending(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json()) as { ok: boolean; errors?: Record<string, string> };
      if (!json.ok) { setErrors(json.errors ?? {}); toast.error(json.errors?.form ?? "Please check your details."); return; }
      toast.success("Thanks! We'll message you on WhatsApp shortly.");
      setForm({ name: "", phone: "", message: "" });
      setOpen(false);
    } catch {
      toast.error("No connection. Check your internet and try again.");
    } finally {
      setSending(false);
    }
  };
  return (<>
    <Button variant="secondary" onClick={() => setOpen(true)}>{label}</Button>
    <Drawer open={open} onClose={() => setOpen(false)}>
      <div style={{ position: "relative", height: 180, flex: "none", backgroundImage: "url(/brand/icon-pattern.svg), linear-gradient(to top,#1A2BFF,#0A7BFF 55%,#1CCBFF)", backgroundSize: "110px auto, 100% 100%" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(26,43,255,.8)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2.4, background: "#1CCBFF", boxShadow: "0 0 8px #1CCBFF" }} />
        <div className="left-6 right-6 bottom-6 md:left-9 md:right-9 md:bottom-8" style={{ position: "absolute", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, color: "#FFF" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><Eyebrow color="#FFF">Talk to us</Eyebrow><span style={{ font: "800 clamp(26px, 4vw, 32px)/1 var(--font-sora), sans-serif", letterSpacing: "-0.03em" }}>What do you need?</span></div>
          <CloseButton light onClick={() => setOpen(false)} />
        </div>
      </div>
      <form noValidate onSubmit={submit} className="px-6 py-7 md:px-9 md:py-8" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <Chips label="I'm interested in" options={["Mobile app", "Website", "POS system", "Custom software"]} value={need} onChange={setNeed} />
        <Input label="Your name" placeholder="e.g. Tendai Moyo" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name || undefined} />
        <Input label="Phone (WhatsApp)" placeholder="+263 77 000 0000" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} error={errors.phone || undefined} />
        <TextArea label="Tell us a little more" rows={4} placeholder="What does your business do, and what should the software help with?" value={form.message} onChange={set("message")} error={errors.message || undefined} />
        <Button type="submit" dot full size="lg" disabled={sending}>{sending ? "Sending…" : "Send to CVT"}</Button>
        <Button variant="secondary" full href={company.whatsapp ? `https://wa.me/${company.whatsapp}` : "#"}>Chat on WhatsApp</Button>
      </form>
    </Drawer>
  </>);
}
