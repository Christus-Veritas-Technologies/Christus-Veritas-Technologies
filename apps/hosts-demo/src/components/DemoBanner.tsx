"use client";
import React, { useState, useEffect } from "react";

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("thornfield-demo-banner") : null;
    if (!stored) setDismissed(false);
  }, []);

  function dismiss() {
    localStorage.setItem("thornfield-demo-banner", "1");
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div className="bg-[var(--accent)] text-white text-sm py-2.5 px-4 flex items-center justify-between gap-4">
      <p className="flex-1 text-center">
        <strong>Demo Mode</strong> — This is a demonstration of the Thornfield Guest House management dashboard. 
        Data is seeded and non-production. <a href="https://hosts.christusveritastech.co.zw" className="underline hover:no-underline" target="_blank" rel="noopener noreferrer">Learn how to get this for your property →</a>
      </p>
      <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 opacity-80 hover:opacity-100">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
  );
}
