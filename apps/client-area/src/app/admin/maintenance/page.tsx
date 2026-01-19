'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { format, formatDistanceToNow } from 'date-fns';
import {
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Calendar,
    Mail,
    Plus,
    ChevronRight,
    AlertCircle,
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
    cashConfirmedAt: string | null;
    paidAt: string | null;
    lastReminderSent: string | null;
    reminderCount: number;
    notes: string | null;
    project: {
        id: string;
        title: string;
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    };
}

interface Project {
    id: string;
    title: string;
    status: string;
    user: {
        id: string;
        email: string;
        name: string | null;
    };
}

export default function AdminMaintenancePage() {
    const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unpaid' | 'overdue' | 'due-soon'>('unpaid');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [monthlyFee, setMonthlyFee] = useState('');

    useEffect(() => {
        loadMaintenance();
        loadProjects();
    }, [filter]);

    const loadMaintenance = async () => {
        setLoading(true);
        try {
            let url = '/api/maintenance/admin/all';

            if (filter === 'overdue') {
                url = '/api/maintenance/admin/overdue';
            } else if (filter === 'due-soon') {
                url = '/api/maintenance/admin/due-soon?days=7';
            }

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.ok) {
                let data = await res.json();

                // Filter unpaid if needed
                if (filter === 'unpaid') {
                    data = data.filter((m: Maintenance) => !m.isPaidForCurrentMonth);
                }

                setMaintenance(data);
            }
        } catch (error) {
            console.error('Failed to load maintenance:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                // Filter to completed projects only
                const completed = data.filter((p: Project) => p.status === 'COMPLETED');
                setProjects(completed);
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const handleCreateMaintenance = async () => {
        if (!selectedProjectId || !monthlyFee) return;

        try {
            const res = await fetch('/api/maintenance/admin/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    projectId: selectedProjectId,
                    monthlyFee: Math.round(parseFloat(monthlyFee) * 100), // Convert to cents
                }),
            });

            if (res.ok) {
                setCreateDialogOpen(false);
                setSelectedProjectId('');
                setMonthlyFee('');
                loadMaintenance();
            }
        } catch (error) {
            console.error('Failed to create maintenance:', error);
        }
    };

    const handleConfirmCash = async (id: string) => {
        try {
            const res = await fetch(`/api/maintenance/admin/${id}/confirm-cash`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.ok) {
                loadMaintenance();
            }
        } catch (error) {
            console.error('Failed to confirm cash payment:', error);
        }
    };

    const handleAdvancePeriod = async (id: string) => {
        if (!confirm('Advance to next billing period? This will reset payment status.')) return;

        try {
            const res = await fetch(`/api/maintenance/admin/${id}/advance-period`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.ok) {
                loadMaintenance();
            }
        } catch (error) {
            console.error('Failed to advance period:', error);
        }
    };

    const handleSendReminder = async (id: string) => {
        try {
            const res = await fetch(`/api/maintenance/admin/${id}/reminder-sent`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.ok) {
                loadMaintenance();
                alert('Reminder marked as sent');
            }
        } catch (error) {
            console.error('Failed to update reminder:', error);
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
                return <Badge className="bg-yellow-500">Cash Pending</Badge>;
            }
            return <Badge className="bg-green-500">Paid</Badge>;
        }

        if (periodEnd < now) {
            return <Badge variant="destructive">Overdue</Badge>;
        }

        const daysUntilDue = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue <= 7) {
            return <Badge className="bg-orange-500">Due Soon ({daysUntilDue}d)</Badge>;
        }

        return <Badge variant="outline">Unpaid</Badge>;
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Maintenance Management</h1>
                    <p className="text-muted-foreground">Track monthly maintenance contracts</p>
                </div>

                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Maintenance
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Maintenance Contract</DialogTitle>
                            <DialogDescription>
                                Set up monthly maintenance for a completed project
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="project">Project</Label>
                                <select
                                    id="project"
                                    className="w-full border rounded-md p-2"
                                    value={selectedProjectId}
                                    onChange={(e) => setSelectedProjectId(e.target.value)}
                                >
                                    <option value="">Select a project...</option>
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.title} - {p.user.name || p.user.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="fee">Monthly Fee (USD)</Label>
                                <Input
                                    id="fee"
                                    type="number"
                                    step="0.01"
                                    placeholder="20.00"
                                    value={monthlyFee}
                                    onChange={(e) => setMonthlyFee(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleCreateMaintenance}
                                disabled={!selectedProjectId || !monthlyFee}
                                className="w-full"
                            >
                                Create Contract
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                <Button
                    variant={filter === 'unpaid' ? 'default' : 'outline'}
                    onClick={() => setFilter('unpaid')}
                >
                    Unpaid
                </Button>
                <Button
                    variant={filter === 'overdue' ? 'default' : 'outline'}
                    onClick={() => setFilter('overdue')}
                >
                    Overdue
                </Button>
                <Button
                    variant={filter === 'due-soon' ? 'default' : 'outline'}
                    onClick={() => setFilter('due-soon')}
                >
                    Due Soon
                </Button>
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                >
                    All Active
                </Button>
            </div>

            {/* Maintenance Cards */}
            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : maintenance.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No maintenance contracts found
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {maintenance.map((m) => (
                        <Card key={m.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{m.project.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {m.project.user.name || m.project.user.email}
                                        </p>
                                    </div>
                                    {getStatusBadge(m)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <DollarSign className="w-4 h-4" />
                                            Monthly Fee
                                        </div>
                                        <div className="font-semibold">{formatCurrency(m.monthlyFee)}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <Calendar className="w-4 h-4" />
                                            Period
                                        </div>
                                        <div className="text-sm">
                                            {format(new Date(m.currentPeriodStart), 'MMM d')} - {format(new Date(m.currentPeriodEnd), 'MMM d, yyyy')}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <Clock className="w-4 h-4" />
                                            Due
                                        </div>
                                        <div className="text-sm">
                                            {formatDistanceToNow(new Date(m.currentPeriodEnd), { addSuffix: true })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <Mail className="w-4 h-4" />
                                            Reminders
                                        </div>
                                        <div className="text-sm">
                                            {m.reminderCount} sent
                                            {m.lastReminderSent && (
                                                <span className="text-xs text-muted-foreground block">
                                                    Last: {formatDistanceToNow(new Date(m.lastReminderSent), { addSuffix: true })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                {m.isPaidForCurrentMonth && (
                                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                        <div className="flex items-center gap-2 text-sm text-green-800">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>
                                                Paid {m.paidInCash ? 'via Cash' : 'via Paynow'}
                                                {m.paidAt && ` on ${format(new Date(m.paidAt), 'MMM d, yyyy')}`}
                                            </span>
                                        </div>
                                        {m.paidInCash && !m.cashConfirmed && (
                                            <div className="flex items-center gap-2 text-sm text-yellow-800 mt-2">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>Cash payment pending confirmation</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    {m.paidInCash && !m.cashConfirmed && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleConfirmCash(m.id)}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Confirm Cash
                                        </Button>
                                    )}

                                    {!m.isPaidForCurrentMonth && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleSendReminder(m.id)}
                                        >
                                            <Mail className="w-4 h-4 mr-2" />
                                            Send Reminder
                                        </Button>
                                    )}

                                    {m.isPaidForCurrentMonth && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAdvancePeriod(m.id)}
                                        >
                                            <ChevronRight className="w-4 h-4 mr-2" />
                                            Advance Period
                                        </Button>
                                    )}
                                </div>

                                {m.notes && (
                                    <div className="text-sm text-muted-foreground border-t pt-3">
                                        <strong>Notes:</strong> {m.notes}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
