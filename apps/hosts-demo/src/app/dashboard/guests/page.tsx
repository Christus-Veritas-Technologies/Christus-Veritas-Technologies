"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  bookings: Array<{ id: string; reference: string; status: string; checkIn: string; amount: number }>;
};

const STATUS_COLORS: Record<string, string> = { confirmed: "success", pending: "warning", cancelled: "destructive" };

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/guests?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((d) => {
        setGuests(d.guests);
        setTotal(d.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  const filtered = search
    ? guests.filter((g) =>
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        g.email.toLowerCase().includes(search.toLowerCase()) ||
        (g.phone ?? "").includes(search)
      )
    : guests;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-barlow)] font-black text-2xl text-[var(--text-primary)]">Guests</h1>
          <p className="text-sm text-[var(--text-secondary)]">{total} registered guests</p>
        </div>
      </div>

      <Card className="mb-5">
        <CardContent className="p-4">
          <Input
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                  {["Guest", "Contact", "Bookings", "Total Spent", "Guest Since"].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-12 text-center text-[var(--text-secondary)]">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-[var(--text-secondary)]">No guests found.</td></tr>
                ) : (
                  filtered.map((g) => {
                    const totalSpent = g.bookings
                      .filter((b) => b.status === "confirmed")
                      .reduce((s, b) => s + b.amount, 0);
                    return (
                      <tr key={g.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[var(--accent)]/15 flex items-center justify-center text-[var(--accent)] font-[family-name:var(--font-barlow)] font-bold text-sm shrink-0">
                              {g.firstName[0]}{g.lastName[0]}
                            </div>
                            <span className="font-medium text-[var(--text-primary)]">{g.firstName} {g.lastName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-[var(--text-secondary)]">{g.email}</p>
                          {g.phone && <p className="text-xs text-[var(--text-secondary)]">{g.phone}</p>}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {g.bookings.slice(0, 2).map((b) => (
                              <Badge key={b.id} variant={STATUS_COLORS[b.status] as any} className="text-xs">{b.reference}</Badge>
                            ))}
                            {g.bookings.length > 2 && (
                              <Badge variant="secondary" className="text-xs">+{g.bookings.length - 2} more</Badge>
                            )}
                            {g.bookings.length === 0 && <span className="text-xs text-[var(--text-secondary)]">No bookings</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {totalSpent > 0 ? formatCurrency(totalSpent) : <span className="text-[var(--text-secondary)]">—</span>}
                        </td>
                        <td className="py-3 px-4 text-[var(--text-secondary)] whitespace-nowrap">
                          {format(new Date(g.createdAt), "d MMM yyyy")}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
