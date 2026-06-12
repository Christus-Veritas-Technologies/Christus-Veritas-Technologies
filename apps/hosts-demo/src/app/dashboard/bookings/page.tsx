"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

type Booking = {
  id: string; reference: string; status: string; checkIn: string; checkOut: string;
  nights: number; guestCount: number; amount: number;
  room: { name: string };
  guest: { firstName: string; lastName: string; email: string };
};

const STATUS_COLORS: Record<string, string> = { confirmed: "success", pending: "warning", cancelled: "destructive" };

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (statusFilter !== "all") params.set("status", statusFilter);
    fetch(`/api/bookings?${params}`)
      .then((r) => r.json())
      .then((d) => { setBookings(d.bookings); setTotal(d.total); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page, statusFilter]);

  const filtered = search
    ? bookings.filter((b) =>
        b.reference.toLowerCase().includes(search.toLowerCase()) ||
        b.guest.firstName.toLowerCase().includes(search.toLowerCase()) ||
        b.guest.lastName.toLowerCase().includes(search.toLowerCase()) ||
        b.guest.email.toLowerCase().includes(search.toLowerCase()) ||
        b.room.name.toLowerCase().includes(search.toLowerCase())
      )
    : bookings;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-barlow)] font-black text-2xl text-[var(--text-primary)]">Bookings</h1>
          <p className="text-sm text-[var(--text-secondary)]">{total} total bookings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/api/export/csv" download>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              CSV
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href="/api/export/pdf" download>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              PDF
            </a>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-5">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by reference, guest, room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                  {["Reference", "Guest", "Room", "Check-In", "Check-Out", "Nights", "Amount", "Status"].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="py-12 text-center text-[var(--text-secondary)]">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-[var(--text-secondary)]">No bookings found.</td></tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="py-3 px-4 font-[family-name:var(--font-barlow)] font-bold text-[var(--accent)] whitespace-nowrap">{b.reference}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-[var(--text-primary)]">{b.guest.firstName} {b.guest.lastName}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{b.guest.email}</p>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-secondary)] whitespace-nowrap">{b.room.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{format(new Date(b.checkIn), "d MMM yyyy")}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{format(new Date(b.checkOut), "d MMM yyyy")}</td>
                      <td className="py-3 px-4 text-center">{b.nights}</td>
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{formatCurrency(b.amount)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={STATUS_COLORS[b.status] as any} className="capitalize">{b.status}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="px-3 py-1.5 text-sm text-[var(--text-secondary)]">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
