"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Package,
    Plus,
    Pencil,
    Trash,
    Users,
    CurrencyDollar,
    CheckCircle,
    XCircle,
} from "@phosphor-icons/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface ServiceDefinition {
    id: string;
    name: string;
    description: string | null;
    oneOffPrice: number;
    recurringPrice: number;
    recurringPricePerUnit: boolean;
    billingCycleDays: number;
    isActive: boolean;
    createdAt: string;
    _count?: {
        clientServices: number;
    };
}

interface ServiceStats {
    definitions: {
        total: number;
        active: number;
    };
    clientServices: {
        total: number;
        active: number;
        suspended: number;
    };
    revenueByService: Array<{
        name: string;
        count: number;
        monthlyRevenue: number;
    }>;
}

export default function ServicesPage() {
    const [services, setServices] = useState<ServiceDefinition[]>([]);
    const [stats, setStats] = useState<ServiceStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceDefinition | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        oneOffPrice: "",
        recurringPrice: "",
        recurringPricePerUnit: false,
        billingCycleDays: "30",
        isActive: true,
    });

    const getToken = () => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const token = getToken();

            const [servicesRes, statsRes] = await Promise.all([
                fetch(`${API_URL}/services/definitions?includeInactive=true`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${API_URL}/admin/services/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (servicesRes.ok) {
                const servicesData = await servicesRes.json();
                setServices(servicesData);
            }

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateDialog = () => {
        setEditingService(null);
        setFormData({
            name: "",
            description: "",
            oneOffPrice: "",
            recurringPrice: "",
            recurringPricePerUnit: false,
            billingCycleDays: "30",
            isActive: true,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (service: ServiceDefinition) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description || "",
            oneOffPrice: (service.oneOffPrice / 100).toString(),
            recurringPrice: (service.recurringPrice / 100).toString(),
            recurringPricePerUnit: service.recurringPricePerUnit,
            billingCycleDays: service.billingCycleDays.toString(),
            isActive: service.isActive,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const token = getToken();
            const payload = {
                name: formData.name,
                description: formData.description || null,
                oneOffPrice: Math.round(parseFloat(formData.oneOffPrice || "0") * 100),
                recurringPrice: Math.round(parseFloat(formData.recurringPrice || "0") * 100),
                recurringPricePerUnit: formData.recurringPricePerUnit,
                billingCycleDays: parseInt(formData.billingCycleDays),
                isActive: formData.isActive,
            };

            const url = editingService
                ? `${API_URL}/services/definitions/${editingService.id}`
                : `${API_URL}/services/definitions`;

            const res = await fetch(url, {
                method: editingService ? "PATCH" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save service");

            setIsDialogOpen(false);
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const deleteService = async (serviceId: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            const token = getToken();
            const res = await fetch(`${API_URL}/services/definitions/${serviceId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete service");

            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const formatCurrency = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Services</h1>
                    <p className="text-muted-foreground">
                        Manage service definitions and client provisioning
                    </p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Service
                </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Services</p>
                                    <p className="text-2xl font-bold">{stats.definitions.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Services</p>
                                    <p className="text-2xl font-bold">{stats.definitions.active}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Client Subscriptions</p>
                                    <p className="text-2xl font-bold">{stats.clientServices.active}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <CurrencyDollar className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Monthly Recurring</p>
                                    <p className="text-2xl font-bold">
                                        ${stats.revenueByService.reduce((sum, s) => sum + s.monthlyRevenue, 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Services Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Service Definitions</CardTitle>
                    <CardDescription>
                        Configure services that can be provisioned to clients
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead>One-Off Price</TableHead>
                                <TableHead>Recurring Price</TableHead>
                                <TableHead>Billing Cycle</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(6)].map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : services.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground">No services defined</p>
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                            onClick={openCreateDialog}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create First Service
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                services.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{service.name}</p>
                                                {service.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {service.description}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatCurrency(service.oneOffPrice)}</TableCell>
                                        <TableCell>
                                            {formatCurrency(service.recurringPrice)}
                                            {service.recurringPricePerUnit && (
                                                <span className="text-muted-foreground">/unit</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{service.billingCycleDays} days</TableCell>
                                        <TableCell>
                                            {service.isActive ? (
                                                <Badge className="bg-green-100 text-green-700">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditDialog(service)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => deleteService(service.id)}
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Revenue by Service */}
            {stats && stats.revenueByService.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Service</CardTitle>
                        <CardDescription>Monthly recurring revenue breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.revenueByService.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Package className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.count} active subscription{item.count !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-semibold">
                                        ${item.monthlyRevenue.toLocaleString()}/mo
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingService ? "Edit Service" : "Create Service"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingService
                                ? "Update the service definition"
                                : "Create a new service that can be provisioned to clients"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                placeholder="Service name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Brief description of the service"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="oneOffPrice">One-Off Price ($)</Label>
                                <Input
                                    id="oneOffPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.oneOffPrice}
                                    onChange={(e) =>
                                        setFormData({ ...formData, oneOffPrice: e.target.value })
                                    }
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="recurringPrice">Recurring Price ($)</Label>
                                <Input
                                    id="recurringPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.recurringPrice}
                                    onChange={(e) =>
                                        setFormData({ ...formData, recurringPrice: e.target.value })
                                    }
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="billingCycleDays">Billing Cycle (days)</Label>
                            <Input
                                id="billingCycleDays"
                                type="number"
                                min="1"
                                value={formData.billingCycleDays}
                                onChange={(e) =>
                                    setFormData({ ...formData, billingCycleDays: e.target.value })
                                }
                                placeholder="30"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="recurringPricePerUnit">Price per unit</Label>
                            <Switch
                                id="recurringPricePerUnit"
                                checked={formData.recurringPricePerUnit}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, recurringPricePerUnit: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="isActive">Active</Label>
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, isActive: checked })
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving
                                    ? "Saving..."
                                    : editingService
                                        ? "Update Service"
                                        : "Create Service"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
