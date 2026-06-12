import React from "react";
import DashSidebar from "@/components/DashSidebar";
import DemoBanner from "@/components/DemoBanner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <DemoBanner />
      <div className="flex flex-1">
        <DashSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
