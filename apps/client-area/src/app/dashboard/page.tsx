"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Buildings,
    CreditCard,
    CalendarBlank,
    ArrowRight,
    Receipt,
    Headset,
    CheckCircle,
    Warning,
    XCircle,
    CurrencyDollar,
    Briefcase,
    Package,
    Plus,
} from "@phosphor-icons/react";
import Link from "next/link";

interface DashboardStats {
    user: {
        id: string;
        name: string;
        email: string;
    };
    organization: {
        id: string;
        name: string;
    } | null;
    stats: {
        activeProjects: number;
        completedProjects: number;
        pendingQuotes: number;
        totalSpent: number;
        activeServices: number;
        pendingInvoices: number;
    };
    billing: {
        status: string;
        currentBalance: number;
        nextInvoiceDate: string;
    };
    recentInvoices: Array<{
        id: string;
        invoiceNumber: string;
        total: number;
        amountDue: number;
        status: string;
        dueAt: string;
    }>;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case "ACTIVE":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Active
                </Badge>
            );
        case "OVERDUE":
            return (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
                    <Warning weight="fill" className="w-3 h-3" />
                    Overdue
                </Badge>
            );
        case "SUSPENDED":
            return (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
                    <XCircle weight="fill" className="w-3 h-3" />
                    Suspended
                </Badge>
            );
        default:
            return (
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 gap-1">
                    {status}
                </Badge>
            );
    }
};

const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100);
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export default function ClientDashboardPage() {
    const [data, setData] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/dashboard/stats`,
                    { credentials: 'include' }
                );
                if (response.ok) {
                    const stats = await response.json();
                    setData(stats);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (isLoading) {
        return (
            <div className="p-6 flex justify-center items-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Warning weight="duotone" className="w-12 h-12 text-amber-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Unable to load dashboard</h3>
                        <p className="text-muted-foreground">Please try refreshing the page.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isOverdue = data.billing.status === "OVERDUE";
    const organizationName = data.organization?.name || data.user?.name || "Your Account";

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Header with Organization Info */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900">{organizationName}</h1>
                        {getStatusBadge(data.billing.status)}
                    </div>
                    <p className="text-muted-foreground">
                        Dashboard Overview
                    </p>
                </div>
                {isOverdue && (
                    <Button className="bg-amber-500 hover:bg-amber-600 gap-2" asChild>
                        <Link href="/dashboard/billing">
                            <CreditCard weight="bold" className="w-4 h-4" />
                            Pay Now
                        </Link>
                    </Button>
                )}
            </motion.div>

            {/* Account Status Cards */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Active Projects */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Briefcase weight="duotone" className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active Projects</p>
                                <p className="text-2xl font-bold">{data.stats.activeProjects}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Services */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Package weight="duotone" className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active Services</p>
                                <p className="text-2xl font-bold">{data.stats.activeServices}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Invoices */}
                <Card className={data.stats.pendingInvoices > 0 ? "border-amber-200 bg-amber-50/50" : ""}>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${data.stats.pendingInvoices > 0 ? "bg-amber-100" : "bg-green-100"
                                }`}>
                                <Receipt weight="duotone" className={`w-6 h-6 ${data.stats.pendingInvoices > 0 ? "text-amber-600" : "text-green-600"
                                    }`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Invoices</p>
                                <p className={`text-2xl font-bold ${data.stats.pendingInvoices > 0 ? "text-amber-600" : ""
                                    }`}>{data.stats.pendingInvoices}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Spent */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <CurrencyDollar weight="duotone" className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Spent</p>
                                <p className="text-2xl font-bold">{formatCurrency(data.stats.totalSpent)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Actions & Account Summary */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Quick Actions */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common tasks and shortcuts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-between group hover:border-primary"
                                asChild
                            >
                                <Link href="/dashboard/projects">
                                    <span className="flex items-center gap-2">
                                        <Plus weight="regular" className="w-4 h-4" />
                                        Request a Project
                                    </span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-between group hover:border-primary"
                                asChild
                            >
                                <Link href="/dashboard/billing">
                                    <span className="flex items-center gap-2">
                                        <Receipt weight="regular" className="w-4 h-4" />
                                        View Invoices
                                    </span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>

                            {isOverdue && (
                                <Button
                                    className="w-full justify-between bg-amber-500 hover:bg-amber-600"
                                    asChild
                                >
                                    <Link href="/dashboard/billing">
                                        <span className="flex items-center gap-2">
                                            <CreditCard weight="bold" className="w-4 h-4" />
                                            Pay Outstanding Balance
                                        </span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                className="w-full justify-between group hover:border-primary"
                                asChild
                            >
                                <Link href="/dashboard/services">
                                    <span className="flex items-center gap-2">
                                        <Package weight="regular" className="w-4 h-4" />
                                        View Services
                                    </span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-between group hover:border-primary"
                                asChild
                            >
                                <Link href="mailto:support@cvt.co.zw">
                                    <span className="flex items-center gap-2">
                                        <Headset weight="regular" className="w-4 h-4" />
                                        Contact Support
                                    </span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Account Summary */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Summary</CardTitle>
                            <CardDescription>
                                Your billing and project overview
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Buildings weight="duotone" className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm">Account Status</span>
                                </div>
                                {getStatusBadge(data.billing.status)}
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <CalendarBlank weight="duotone" className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm">Next Invoice</span>
                                </div>
                                <span className="font-medium">{formatDate(data.billing.nextInvoiceDate)}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Briefcase weight="duotone" className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm">Completed Projects</span>
                                </div>
                                <span className="font-medium">{data.stats.completedProjects}</span>
                            </div>

                            {data.stats.pendingQuotes > 0 && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CurrencyDollar weight="fill" className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800">
                                                {data.stats.pendingQuotes} quote{data.stats.pendingQuotes > 1 ? 's' : ''} waiting for your response
                                            </span>
                                        </div>
                                        <Button size="sm" asChild>
                                            <Link href="/dashboard/projects">View</Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Invoices */}
            {data.recentInvoices.length > 0 && (
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Pending Invoices</CardTitle>
                                    <CardDescription>
                                        Invoices that require payment
                                    </CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/dashboard/billing">View All</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.recentInvoices.map((invoice) => (
                                    <div
                                        key={invoice.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium">{invoice.invoiceNumber}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Due: {invoice.dueAt ? formatDate(invoice.dueAt) : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{formatCurrency(invoice.amountDue)}</p>
                                            <Badge
                                                className={
                                                    invoice.status === 'OVERDUE'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }
                                            >
                                                {invoice.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
}
