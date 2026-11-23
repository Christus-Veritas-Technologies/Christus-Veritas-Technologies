"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs } from "@/components/ui/Tabs";
import { AppCard, ClientCard } from "./AppCard";
import { Gallery } from "./Gallery";
import { apps, clientSystems, type AppEntry } from "@/content/site";

type K = "all" | "business" | "consumer" | "client";

export function WorkGrid() {
  const [tab, setTab] = useState<K>("all");
  const [open, setOpen] = useState<AppEntry | null>(null);
  const params = useSearchParams();
  useEffect(() => { const s = params.get("app"); if (s) setOpen(apps.find((a) => a.slug === s) ?? null); }, [params]);
  const count = (k: K) => (k === "all" ? apps.length + clientSystems.length : k === "client" ? clientSystems.length : apps.filter((a) => a.type === k).length);
  const shownApps = tab === "client" ? [] : apps.filter((a) => tab === "all" || a.type === tab);
  const shownClients = tab === "all" || tab === "client" ? clientSystems : [];
  return (
    <>
      <div className="container" style={{ paddingBottom: 28, minWidth: 0, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <Tabs id="work" value={tab} onChange={setTab} tabs={[{ key: "all", label: "All", count: count("all") }, { key: "business", label: "Business tools", count: count("business") }, { key: "consumer", label: "Consumer apps", count: count("consumer") }, { key: "client", label: "Client systems", count: count("client") }]} />
        <span style={{ font: "500 11px/1 var(--font-mono), monospace", letterSpacing: ".1em", color: "#4A4A4A" }}>SHOWING {shownApps.length + shownClients.length} OF {count("all")}</span>
      </div>
      <motion.div layout className="container grid grid-flow-row-dense grid-cols-1 gap-5 pb-20 md:grid-cols-2 md:gap-6 md:pb-28 lg:grid-cols-3" style={{ alignItems: "start" }}>
        <AnimatePresence mode="popLayout">
          {shownApps.map((a, i) => (
            <motion.div layout key={a.slug} initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }} transition={{ duration: 0.45, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }} className={tab === "all" && i === 0 ? "md:col-span-2" : undefined}>
              <AppCard app={a} featured={tab === "all" && i === 0} onOpen={() => setOpen(a)} />
            </motion.div>
          ))}
          {shownClients.map((cl, i) => (
            <motion.div layout key={cl.name} initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }} transition={{ duration: 0.45, delay: (shownApps.length + i) * 0.05, ease: [0.2, 0.8, 0.2, 1] }} className={tab === "all" && i === 1 ? "md:col-span-2" : undefined}>
              <ClientCard {...cl} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <Gallery app={open} onClose={() => setOpen(null)} />
    </>
  );
}
