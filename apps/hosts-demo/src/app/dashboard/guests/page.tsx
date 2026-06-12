"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Guest = {
  id: string; firstName: string; lastName: string; email: string; phone: string | null; createdAt: string;
  bookings: Array<{ id: string; reference: string; status: string }>;
};

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch all bookings to derive guest list
    fetch("/api/bookings?limit=100")
      .then((r) => r.json())
      .then((d) => {
        // Build unique guest map from bookings
        const guestMap = new Map<string, Guest>();
        for (const b of d.bookings) {
          const g = b.guest;
          if (!guestMap.has(g.email)) {
            guestMap.set(g.email, {
              id: g.id ?? g.email,
              firstName: g.firstName,
              lastName: g.lastName,
              email: g.email,
              phone: g.phone ?? null,
              createdAt: b.createdAt,
              bookings: [],
            });
          }
          guestMap.get(g.email)!.bookings.push({ id: b.id, reference: b.reference, status: b.status });
        }
        setGuests(Array.from(guestMap.values()));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = search
    ? guests.filter((g) =>
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        g.email.toLowerCase().includes(search.toLowerCase()) ||
        (g.phone ?? "").includes(search)
      )
    : guests;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-barlow)] font-black text-2xl text-[var(--text-primary)]">Guests</h1>
        <p className="text-sm text-[var(--text-secondary)]">{guests.length} unique guests</p>
      </div>

      <Card className="mb-5">
        <CardContent className="p-4">
          <Input
            placeholder="Search by name, email, or phone..."
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
                  {["Guest", "Email", "Phone", "Bookings", "First Stay"].map((h) => (
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
                  filtered.map((g) => (
                    <tr key={g.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-subtle)]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 flex items-center justify-center text-[var(--accent)] font-[family-name:var(--font-barlow)] font-bold text-sm shrink-0">
                            {g.firstName[0]}{g.lastName[0]}
                          </div>
                          <span className="font-medium text-[var(--text-primary)]">{g.firstName} {g.lastName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">{g.email}</td>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">{g.phone ?? "—"}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {g.bookings.slice(0, 3).map((b) => (
                            <Badge key={b.id} variant="secondary" className="text-xs">{b.reference}</Badge>
                          ))}
                          {g.bookings.length > 3 && <Badge variant="secondary" className="text-xs">+{g.bookings.length - 3}</Badge>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-secondary)] whitespace-nowrap">
                        {format(new Date(g.createdAt), "d MMM yyyy")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
