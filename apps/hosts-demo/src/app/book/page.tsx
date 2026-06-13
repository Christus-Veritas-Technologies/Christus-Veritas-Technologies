"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format, differenceInCalendarDays, eachDayOfInterval, addDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeUp } from "@/components/Animate";
import { motion, AnimatePresence } from "framer-motion";

const ROOMS = [
  { id: "garden-suite", name: "Garden Suite", category: "Suite", rate: 950, capacity: 2, bedType: "Queen Bed", photo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
  { id: "mountain-view", name: "Mountain View Room", category: "Deluxe", rate: 1200, capacity: 2, bedType: "King Bed", photo: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80" },
  { id: "family-room", name: "Family Room", category: "Family", rate: 1800, capacity: 4, bedType: "2× Queen Beds", photo: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&q=80" },
  { id: "honeymoon-suite", name: "Honeymoon Suite", category: "Luxury", rate: 2200, capacity: 2, bedType: "Super King", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
];

type Step = 1 | 2 | 3;

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {([1, 2, 3] as const).map((s) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-2 ${s <= current ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-[family-name:var(--font-barlow)] transition-all duration-300 ${s < current ? "bg-[var(--accent)] text-white" : s === current ? "bg-[var(--text-primary)] text-white" : "bg-[var(--border)] text-[var(--text-secondary)]"}`}>
              {s < current ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : s}
            </div>
            <span className="text-sm font-medium hidden sm:inline font-[family-name:var(--font-barlow)]">
              {s === 1 ? "Select Room" : s === 2 ? "Your Details" : "Review & Pay"}
            </span>
          </div>
          {s < 3 && <div className={`h-px w-10 transition-colors duration-300 ${s < current ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const preSelectedRoom = searchParams.get("room") ?? "";
  const preFrom = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
  const preTo = searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined;
  const preGuests = searchParams.get("guests") ?? "2";

  const [step, setStep] = useState<Step>(1);
  const [selectedRoom, setSelectedRoom] = useState(preSelectedRoom);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    preFrom && preTo ? { from: preFrom, to: preTo } : undefined
  );
  const [guests, setGuests] = useState(preGuests);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", specialRequests: "" });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");

  const room = ROOMS.find((r) => r.id === selectedRoom);
  const nights = dateRange?.from && dateRange?.to ? differenceInCalendarDays(dateRange.to, dateRange.from) : 0;
  const total = room ? room.rate * Math.max(nights, 1) : 0;

  useEffect(() => {
    fetch("/api/availability" + (selectedRoom ? `?roomId=${selectedRoom}` : ""))
      .then((r) => r.json())
      .then((data: { checkIn: string; checkOut: string }[]) => {
        const dates: Date[] = [];
        for (const b of data) {
          const range = eachDayOfInterval({ start: new Date(b.checkIn), end: addDays(new Date(b.checkOut), -1) });
          dates.push(...range);
        }
        setDisabledDates(dates);
      })
      .catch(() => {});
  }, [selectedRoom]);

  const canProceedStep1 = !!selectedRoom && !!dateRange?.from && !!dateRange?.to && nights > 0;
  const canProceedStep2 = !!(form.firstName && form.lastName && form.email);

  async function handleBook() {
    if (!room || !dateRange?.from || !dateRange?.to) return;
    setLoading(true);
    setError("");

    const steps = [
      "Saving your details…",
      "Processing payment…",
      "Confirming your reservation…",
    ];
    for (const step of steps) {
      setLoadingStep(step);
      await new Promise((r) => setTimeout(r, 900));
    }

    const fakeRef = `TH-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    router.push(`/book/confirmed?ref=${fakeRef}&room=${encodeURIComponent(room.name)}&amount=${total}`);
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      {/* Page header */}
      <div className="bg-[var(--bg-subtle)] border-b border-[var(--border)] pt-24 pb-10 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-2 font-[family-name:var(--font-barlow)]">Direct Booking</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium text-[var(--text-primary)]">Book Your Stay</h1>
          <p className="text-[var(--text-secondary)] mt-2 font-light">No commission fees. Confirmed instantly.</p>
        </motion.div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <StepIndicator current={step} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="font-[family-name:var(--font-barlow)] font-bold text-lg mb-4 text-[var(--text-primary)]">Select a Room</h2>
                        <RadioGroup value={selectedRoom} onValueChange={setSelectedRoom} className="space-y-3">
                          {ROOMS.map((r) => (
                            <label key={r.id} className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${selectedRoom === r.id ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-sm" : "border-[var(--border)] hover:border-[var(--accent)]/40"}`}>
                              <RadioGroupItem value={r.id} id={r.id} />
                              <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                                <Image src={r.photo} alt={r.name} fill className="object-cover" sizes="64px" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-[var(--text-primary)] font-[family-name:var(--font-barlow)]">{r.name}</p>
                                <p className="text-xs text-[var(--text-secondary)]">{r.bedType} · up to {r.capacity} guests</p>
                              </div>
                              <p className="font-[family-name:var(--font-barlow)] font-black text-[var(--accent)] shrink-0 text-base">
                                R{r.rate.toLocaleString("en-ZA")}
                                <span className="text-xs font-normal text-[var(--text-secondary)]">/night</span>
                              </p>
                            </label>
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h2 className="font-[family-name:var(--font-barlow)] font-bold text-lg mb-4 text-[var(--text-primary)]">Select Dates</h2>
                        <div className="overflow-x-auto">
                          <Calendar mode="range" selected={dateRange} onSelect={setDateRange} disabled={[{ before: new Date() }, ...disabledDates.map((d) => new Date(d))]} numberOfMonths={2} className="w-full" />
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-2">Grey dates are already booked.</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 flex items-center gap-4">
                        <Label className="text-sm shrink-0 font-[family-name:var(--font-barlow)]">Number of guests</Label>
                        <Select value={guests} onValueChange={setGuests}>
                          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((n) => (<SelectItem key={n} value={String(n)}>{n} {n === 1 ? "guest" : "guests"}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="sticky top-24">
                      <CardContent className="p-5">
                        <h3 className="font-[family-name:var(--font-barlow)] font-bold text-base mb-4 text-[var(--text-primary)]">Summary</h3>
                        {room ? (
                          <>
                            <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                              <Image src={room.photo} alt={room.name} fill className="object-cover" sizes="300px" />
                            </div>
                            <p className="font-semibold text-sm text-[var(--text-primary)] font-[family-name:var(--font-barlow)]">{room.name}</p>
                            <Badge variant="secondary" className="mt-1 mb-3 text-xs">{room.category}</Badge>
                          </>
                        ) : (
                          <div className="h-32 bg-[var(--bg-subtle)] rounded-xl flex items-center justify-center mb-3">
                            <p className="text-sm text-[var(--text-secondary)]">No room selected</p>
                          </div>
                        )}
                        {dateRange?.from && dateRange?.to && (
                          <>
                            <Separator className="my-3" />
                            <div className="space-y-1.5 text-sm">
                              <div className="flex justify-between text-[var(--text-secondary)]"><span>Check-in</span><span>{format(dateRange.from, "d MMM yyyy")}</span></div>
                              <div className="flex justify-between text-[var(--text-secondary)]"><span>Check-out</span><span>{format(dateRange.to, "d MMM yyyy")}</span></div>
                              <div className="flex justify-between text-[var(--text-secondary)]"><span>Nights</span><span>{nights}</span></div>
                            </div>
                            {room && (
                              <>
                                <Separator className="my-3" />
                                <div className="flex justify-between font-bold text-[var(--text-primary)]">
                                  <span>Total</span>
                                  <span className="text-[var(--accent)] font-[family-name:var(--font-barlow)] text-lg">R{total.toLocaleString("en-ZA")}</span>
                                </div>
                              </>
                            )}
                          </>
                        )}
                        <Button className="w-full mt-4" disabled={!canProceedStep1} onClick={() => setStep(2)}>Continue →</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardContent className="p-6 space-y-5">
                        <h2 className="font-[family-name:var(--font-barlow)] font-bold text-lg text-[var(--text-primary)]">Guest Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="firstName">First name *</Label>
                            <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Jane" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="lastName">Last name *</Label>
                            <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Smith" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email">Email address *</Label>
                          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="phone">Phone number (optional)</Label>
                          <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+27 82 000 0000" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="special">Special requests (optional)</Label>
                          <Textarea id="special" value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} placeholder="Dietary requirements, early check-in, cot needed, etc." rows={3} />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                          <Button className="flex-1" disabled={!canProceedStep2} onClick={() => setStep(3)}>Review Booking →</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <Card className="sticky top-24">
                      <CardContent className="p-5">
                        <h3 className="font-[family-name:var(--font-barlow)] font-bold text-base mb-3 text-[var(--text-primary)]">Your Booking</h3>
                        <p className="font-semibold text-sm text-[var(--text-primary)]">{room?.name}</p>
                        {dateRange?.from && dateRange?.to && (
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{format(dateRange.from, "d MMM")} – {format(dateRange.to, "d MMM yyyy")} · {nights} nights</p>
                        )}
                        <Separator className="my-3" />
                        <div className="flex justify-between font-bold text-[var(--text-primary)]">
                          <span>Total</span>
                          <span className="text-[var(--accent)] font-[family-name:var(--font-barlow)] text-lg">R{total.toLocaleString("en-ZA")}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="font-[family-name:var(--font-barlow)] font-bold text-lg mb-4 text-[var(--text-primary)]">Review Your Booking</h2>
                        <div className="space-y-0 divide-y divide-[var(--border)] text-sm">
                          {[
                            ["Room", room?.name],
                            ["Check-in", dateRange?.from ? format(dateRange.from, "d MMMM yyyy") : ""],
                            ["Check-out", dateRange?.to ? format(dateRange.to, "d MMMM yyyy") : ""],
                            ["Nights", String(nights)],
                            ["Guests", guests],
                            ["Guest name", `${form.firstName} ${form.lastName}`],
                            ["Email", form.email],
                            ...(form.phone ? [["Phone", form.phone]] : []),
                            ...(form.specialRequests ? [["Special requests", form.specialRequests]] : []),
                          ].map(([label, value]) => (
                            <div key={label} className="flex justify-between py-2.5">
                              <span className="text-[var(--text-secondary)]">{label}</span>
                              <span className="font-medium text-[var(--text-primary)] text-right max-w-[60%]">{value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(2)} disabled={loading}>← Back</Button>
                      <Button className="flex-1 text-base" size="lg" onClick={handleBook} disabled={loading}>
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                            {loadingStep}
                          </span>
                        ) : `Confirm & Pay R${total.toLocaleString("en-ZA")}`}
                      </Button>
                    </div>

                    <p className="text-xs text-center text-[var(--text-secondary)]/60 pt-1">
                      Demo environment · no real charge is made
                    </p>
                  </div>

                  <div>
                    <Card className="sticky top-24">
                      <CardContent className="p-5">
                        <h3 className="font-[family-name:var(--font-barlow)] font-bold text-base mb-3 text-[var(--text-primary)]">Price Breakdown</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-[var(--text-secondary)]">
                            <span>R{room?.rate.toLocaleString("en-ZA")} × {nights} nights</span>
                            <span>R{total.toLocaleString("en-ZA")}</span>
                          </div>
                          <div className="flex justify-between text-[var(--text-secondary)]">
                            <span>Commission</span>
                            <span className="text-[var(--success)] font-medium">R0.00</span>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between font-bold text-[var(--text-primary)]">
                          <span>Total</span>
                          <span className="text-[var(--accent)] font-[family-name:var(--font-barlow)] text-xl">R{total.toLocaleString("en-ZA")}</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-2">All taxes included. No hidden fees.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center"><p className="text-[var(--text-secondary)]">Loading...</p></div>}>
      <BookingContent />
    </Suspense>
  );
}
