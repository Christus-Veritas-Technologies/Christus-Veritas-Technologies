"use client";

import { Toaster } from "@Christus-Veritas-Technologies/ui/components/sonner";

import { ThemeProvider } from "./theme-provider";

// The CVT brand is light mode only (see docs/CVT-Brief.md), so the theme is forced.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light" disableTransitionOnChange>
      {children}
      <Toaster richColors />
    </ThemeProvider>
  );
}
