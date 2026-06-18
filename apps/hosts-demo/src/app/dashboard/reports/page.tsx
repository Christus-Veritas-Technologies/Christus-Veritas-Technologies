"use client";
import React, { useEffect, useState } from "react";
import { format, subDays, eachMonthOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type Booking = {
  id: string; reference: string; status: string; checkIn: string; amount: number; nights: number;
  room: { name: string };
  guest: { firstName: string; lastName: string };
};

const ROOM_COLORS = ["var(--accent)", "#3A7D44", "#2563EB", "#9333EA"];

export default function ReportsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings?limit=200")
      .then((r) => r.json())
      .then((d) => { setBookings(d.bookings); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-[var(--text-secondary)]">Loading reports...</div>;

  const confirmed = bookings.filter((b) => b.status === "confirmed");

  // Monthly revenue for last 6 months
  const months = eachMonthOfInterval({ start: subDays(new Date(), 180), end: new Date() });
  const monthlyData = months.map((m) => {
    const start = startOfMonth(m);
    const end = endOfMonth(m);
    const monthBookings = confirmed.filter((b) => {
      const d = new Date(b.checkIn);
      return d >= start && d <= end;
    });
    return {
      month: format(m, "MMM yy"),
      revenue: monthBookings.reduce((s, b) => s + b.amount, 0),
      bookings: monthBookings.length,
    };
  });

  // Room breakdown
  const roomMap = new Map<string, number>();
  for (const b of confirmed) {
    roomMap.set(b.room.name, (roomMap.get(b.room.name) ?? 0) + b.amount);
  }
  const roomData = Array.from(roomMap.entries()).map(([name, revenue]) => ({ name, revenue }));

  // Totals
  const totalRevenue = confirmed.reduce((s, b) => s + b.amount, 0);
  const avgPerBooking = confirmed.length ? Math.round(totalRevenue / confirmed.length) : 0;
  const avgNights = confirmed.length ? (confirmed.reduce((s, b) => s + b.nights, 0) / confirmed.length).toFixed(1) : "0";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-barlow)] font-black text-2xl text-[var(--text-primary)]">Reports</h1>
          <p className="text-sm text-[var(--text-secondary)]">Revenue and booking analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/api/export/csv" download>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Export CSV
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href="/api/export/pdf" download>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Export PDF
            </a>
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue) },
          { label: "Confirmed Bookings", value: String(confirmed.length) },
          { label: "Avg. per Booking", value: formatCurrency(avgPerBooking) },
          { label: "Avg. Nights / Stay", value: String(avgNights) },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide mb-1">{label}</p>
              <p className="font-[family-name:var(--font-barlow)] font-black text-2xl text-[var(--text-primary)]">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly revenue */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString("en-US")}`, "Revenue"]} contentStyle={{ fontSize: 12, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-surface)" }} />
                <Bar dataKey="revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by room */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Revenue by Room</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={roomData} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {roomData.map((_, i) => (
                    <Cell key={i} fill={ROOM_COLORS[i % ROOM_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString("en-US")}`, "Revenue"]} contentStyle={{ fontSize: 12, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-surface)" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly breakdown table */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Breakdown</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                  {["Month", "Bookings", "Revenue", "Avg. per Booking"].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((m) => (
                  <tr key={m.month} className="border-b border-[var(--border)] hover:bg-[var(--bg-subtle)]">
                    <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{m.month}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{m.bookings}</td>
                    <td className="py-3 px-4 font-semibold">{formatCurrency(m.revenue)}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{m.bookings ? formatCurrency(Math.round(m.revenue / m.bookings)) : "—"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[var(--bg-subtle)] font-bold">
                  <td className="py-3 px-4 text-[var(--text-primary)]">Total</td>
                  <td className="py-3 px-4">{monthlyData.reduce((s, m) => s + m.bookings, 0)}</td>
                  <td className="py-3 px-4 text-[var(--accent)]">{formatCurrency(monthlyData.reduce((s, m) => s + m.revenue, 0))}</td>
                  <td className="py-3 px-4">—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
