"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem, FadeUp } from "@/components/Animate";

type Stats = {
  totalBookings: number;
  confirmedBookings: number;
  totalGuests: number;
  totalRevenue: number;
  occupancyRate: number;
  recentBookings: Array<{
    id: string; reference: string; status: string; checkIn: string; checkOut: string; nights: number; amount: number;
    room: { name: string };
    guest: { firstName: string; lastName: string };
  }>;
  revenueChart: Array<{ date: string; revenue: number }>;
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "destructive",
};

function StatCard({ label, value, sub, icon, delay = 0 }: { label: string; value: string; sub?: string; icon: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
            {icon}
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wide font-[family-name:var(--font-barlow)]">{label}</p>
            <p className="font-[family-name:var(--font-barlow)] font-black text-2xl text-[var(--text-primary)] mt-0.5">{value}</p>
            {sub && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{sub}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-[var(--text-secondary)]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </motion.div>
        Loading overview...
      </div>
    );
  }

  if (!stats) {
    return <div className="p-8 text-[var(--danger)]">Failed to load data.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="font-[family-name:var(--font-barlow)] font-black text-2xl text-[var(--text-primary)]">Overview</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{format(new Date(), "EEEE, d MMMM yyyy")}</p>
        </div>
        <Button asChild>
          <Link href="/book">+ New Booking</Link>
        </Button>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard delay={0.05} label="Total Bookings" value={String(stats.totalBookings)} sub={`${stats.confirmedBookings} confirmed`}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="3" x2="21" y1="10" y2="10"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="16" x2="16" y1="2" y2="6"/></svg>}
        />
        <StatCard delay={0.1} label="Total Revenue" value={formatCurrency(stats.totalRevenue)} sub="Confirmed bookings"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8"/><path d="M12 6v2m0 8v2"/></svg>}
        />
        <StatCard delay={0.15} label="Total Guests" value={String(stats.totalGuests)} sub="Unique guests"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard delay={0.2} label="Confirmation Rate" value={`${stats.occupancyRate}%`} sub="Of all bookings"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeUp delay={0.25} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Revenue — Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.revenueChart} margin={{ left: -10 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-secondary)" }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--text-secondary)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString("en-US")}`, "Revenue"]} contentStyle={{ fontSize: 12, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-surface)" }} />
                  <Bar dataKey="revenue" fill="var(--accent)" radius={[3, 3, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.3}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "View All Bookings", href: "/dashboard/bookings" },
                { label: "Guest Directory", href: "/dashboard/guests" },
                { label: "Revenue Reports", href: "/dashboard/reports" },
                { label: "Export CSV", href: "/api/export/csv" },
                { label: "Export PDF", href: "/api/export/pdf" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-subtle)] transition-all text-sm font-medium text-[var(--text-primary)] group">
                  {label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-0.5 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
                </Link>
              ))}
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      <FadeUp delay={0.35} className="mt-6">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link href="/dashboard/bookings">View all</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {["Reference", "Guest", "Room", "Dates", "Amount", "Status"].map((h) => (
                      <th key={h} className="py-2 px-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide font-[family-name:var(--font-barlow)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((b, i) => (
                    <motion.tr
                      key={b.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
                      className="border-b border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-colors"
                    >
                      <td className="py-3 px-3 font-[family-name:var(--font-barlow)] font-bold text-[var(--accent)]">{b.reference}</td>
                      <td className="py-3 px-3">{b.guest.firstName} {b.guest.lastName}</td>
                      <td className="py-3 px-3 text-[var(--text-secondary)]">{b.room.name}</td>
                      <td className="py-3 px-3 text-[var(--text-secondary)]">{format(new Date(b.checkIn), "d MMM")} – {format(new Date(b.checkOut), "d MMM yyyy")}</td>
                      <td className="py-3 px-3 font-semibold">{formatCurrency(b.amount)}</td>
                      <td className="py-3 px-3"><Badge variant={STATUS_COLORS[b.status] as "success" | "warning" | "destructive"} className="capitalize">{b.status}</Badge></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </FadeUp>
    </div>
  );
}
