'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { format, formatDistanceToNow } from 'date-fns';
import {
    CheckCircle,
    Clock,
    DollarSign,
    Calendar,
    CreditCard,
    Banknote,
    AlertCircle,
    Info,
} from 'lucide-react';

interface Maintenance {
    id: string;
    projectId: string;
    monthlyFee: number;
    isActive: boolean;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    isPaidForCurrentMonth: boolean;
    paidInCash: boolean;
    cashConfirmed: boolean;
    paidAt: string | null;
    project: {
        id: string;
        title: string;
        description: string;
    };
}

export default function ClientMaintenancePage() {
    const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'paynow' | null>(null);

    useEffect(() => {
        loadMaintenance();
    }, []);

    const loadMaintenance = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/maintenance/my-maintenance', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setMaintenance(data);
            }
        } catch (error) {
            console.error('Failed to load maintenance:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentClick = (m: Maintenance) => {
        setSelectedMaintenance(m);
        setPaymentDialog(true);
        setPaymentMethod(null);
    };

    const handlePayCash = async () => {
        if (!selectedMaintenance) return;

        try {
            const res = await fetch(`/api/maintenance/${selectedMaintenance.id}/pay-cash`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.ok) {
                setPaymentDialog(false);
                setSelectedMaintenance(null);
                loadMaintenance();
                alert('Cash payment recorded. Awaiting admin confirmation.');
            }
        } catch (error) {
            console.error('Failed to record cash payment:', error);
        }
    };

    const handlePayPaynow = async () => {
        if (!selectedMaintenance) return;

        try {
            const res = await fetch(`/api/maintenance/${selectedMaintenance.id}/pay-paynow`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.ok) {
                setPaymentDialog(false);
                setSelectedMaintenance(null);
                loadMaintenance();
                alert('Payment via Paynow recorded successfully!');
            }
        } catch (error) {
            console.error('Failed to record Paynow payment:', error);
        }
    };

    const formatCurrency = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    const getStatusBadge = (m: Maintenance) => {
        const now = new Date();
        const periodEnd = new Date(m.currentPeriodEnd);

        if (m.isPaidForCurrentMonth) {
            if (m.paidInCash && !m.cashConfirmed) {
                return <Badge className="bg-yellow-500">Pending Confirmation</Badge>;
            }
            return <Badge className="bg-green-500">Paid</Badge>;
        }

        if (periodEnd < now) {
            return <Badge variant="destructive">Overdue</Badge>;
        }

        const daysUntilDue = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue <= 7) {
            return <Badge className="bg-orange-500">Due in {daysUntilDue} days</Badge>;
        }

        return <Badge variant="outline">Upcoming</Badge>;
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">My Maintenance</h1>
                <p className="text-muted-foreground">View and pay your monthly maintenance fees</p>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : maintenance.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Info className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg mb-2">No Maintenance Contracts</h3>
                        <p className="text-muted-foreground">
                            You don't have any active maintenance contracts yet.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {maintenance.map((m) => {
                        const now = new Date();
                        const periodEnd = new Date(m.currentPeriodEnd);
                        const isOverdue = periodEnd < now && !m.isPaidForCurrentMonth;

                        return (
                            <Card key={m.id} className={isOverdue ? 'border-red-300' : ''}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{m.project.title}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {m.project.description}
                                            </p>
                                        </div>
                                        {getStatusBadge(m)}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <DollarSign className="w-4 h-4" />
                                                Monthly Fee
                                            </div>
                                            <div className="text-2xl font-bold">{formatCurrency(m.monthlyFee)}</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <Calendar className="w-4 h-4" />
                                                Current Period
                                            </div>
                                            <div className="text-sm">
                                                {format(new Date(m.currentPeriodStart), 'MMM d')} - {format(new Date(m.currentPeriodEnd), 'MMM d, yyyy')}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <Clock className="w-4 h-4" />
                                                Payment Due
                                            </div>
                                            <div className="text-sm">
                                                {formatDistanceToNow(new Date(m.currentPeriodEnd), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Status */}
                                    {m.isPaidForCurrentMonth ? (
                                        <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                            <div className="flex items-center gap-2 text-green-800">
                                                <CheckCircle className="w-5 h-5" />
                                                <div>
                                                    <div className="font-semibold">
                                                        Payment Received
                                                    </div>
                                                    <div className="text-sm">
                                                        Paid {m.paidInCash ? 'via Cash' : 'via Paynow'}
                                                        {m.paidAt && ` on ${format(new Date(m.paidAt), 'MMM d, yyyy')}`}
                                                    </div>
                                                    {m.paidInCash && !m.cashConfirmed && (
                                                        <div className="text-sm text-yellow-700 mt-1">
                                                            ⏳ Awaiting admin confirmation
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : isOverdue ? (
                                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                            <div className="flex items-center gap-2 text-red-800">
                                                <AlertCircle className="w-5 h-5" />
                                                <div>
                                                    <div className="font-semibold">Payment Overdue</div>
                                                    <div className="text-sm">
                                                        Please make your payment as soon as possible to avoid service interruption.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                            <div className="flex items-center gap-2 text-blue-800">
                                                <Info className="w-5 h-5" />
                                                <div>
                                                    <div className="font-semibold">Payment Pending</div>
                                                    <div className="text-sm">
                                                        Your maintenance payment is due {formatDistanceToNow(periodEnd, { addSuffix: true })}.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment Button */}
                                    {!m.isPaidForCurrentMonth && (
                                        <Button
                                            className="w-full"
                                            onClick={() => handlePaymentClick(m)}
                                        >
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Make Payment
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Payment Dialog */}
            <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Make Payment</DialogTitle>
                        <DialogDescription>
                            Choose your payment method for {selectedMaintenance?.project.title}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMaintenance && (
                        <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                                <div className="text-sm text-muted-foreground">Amount Due</div>
                                <div className="text-3xl font-bold">{formatCurrency(selectedMaintenance.monthlyFee)}</div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    variant={paymentMethod === 'paynow' ? 'default' : 'outline'}
                                    className="w-full justify-start h-auto py-4"
                                    onClick={() => setPaymentMethod('paynow')}
                                >
                                    <CreditCard className="w-6 h-6 mr-3" />
                                    <div className="text-left">
                                        <div className="font-semibold">Pay with Paynow</div>
                                        <div className="text-xs opacity-75">Instant confirmation</div>
                                    </div>
                                </Button>

                                <Button
                                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                                    className="w-full justify-start h-auto py-4"
                                    onClick={() => setPaymentMethod('cash')}
                                >
                                    <Banknote className="w-6 h-6 mr-3" />
                                    <div className="text-left">
                                        <div className="font-semibold">Pay with Cash</div>
                                        <div className="text-xs opacity-75">Requires admin confirmation</div>
                                    </div>
                                </Button>
                            </div>

                            {paymentMethod && (
                                <Button
                                    className="w-full"
                                    onClick={paymentMethod === 'cash' ? handlePayCash : handlePayPaynow}
                                >
                                    Confirm Payment
                                </Button>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
