"use client";
import { useState } from "react";
import { Drawer, CloseButton } from "@/components/ui/Overlay";
import { Input, TextArea, Chips } from "@/components/ui/Fields";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/brand/Neon";
import { company } from "@/content/site";

/** Trigger button + quick-contact drawer. */
export function ContactDrawer({ label = "Not sure which? Talk to us →" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const [need, setNeed] = useState("Mobile app");
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
      <form onSubmit={(e) => { e.preventDefault(); setOpen(false); }} className="px-6 py-7 md:px-9 md:py-8" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <Chips label="I'm interested in" options={["Mobile app", "Website", "POS system", "Custom software"]} value={need} onChange={setNeed} />
        <Input label="Your name" placeholder="e.g. Tendai Moyo" />
        <Input label="Phone (WhatsApp)" placeholder="+263 77 000 0000" type="tel" />
        <TextArea label="Tell us a little more" rows={4} placeholder="What does your business do, and what should the software help with?" />
        <Button type="submit" dot full size="lg">Send to CVT</Button>
        <Button variant="secondary" full href={company.whatsapp ? `https://wa.me/${company.whatsapp}` : "#"}>Chat on WhatsApp</Button>
      </form>
    </Drawer>
  </>);
}
