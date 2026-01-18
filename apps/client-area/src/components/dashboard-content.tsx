"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    Receipt,
    CheckCircle,
    Warning,
    XCircle,
    Briefcase,
    Package,
    Plus,
    DotsThree,
    FolderSimple,
    CaretRight,
} from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

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

interface DashboardContentProps {
    token: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

function DashboardLoadingSkeleton() {
    return (
        <div className="p-6 space-y-8">
            {/* Quick Access Section skeleton */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="border-0 shadow-sm">
                            <CardContent className="p-4">
                                <Skeleton className="w-10 h-10 rounded-lg mb-3" />
                                <Skeleton className="h-5 w-28 mb-1" />
                                <Skeleton className="h-4 w-16" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Main Content Area skeleton */}
            <Card className="border-0 shadow-sm">
                {/* Breadcrumb & Actions Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-28" />
                </div>

                {/* Summary Stats Row skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 text-center space-y-2">
                            <Skeleton className="h-8 w-12 mx-auto" />
                            <Skeleton className="h-4 w-24 mx-auto" />
                        </div>
                    ))}
                </div>

                {/* Recent Invoices section skeleton */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 rounded-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <div className="text-right space-y-2">
                                    <Skeleton className="h-4 w-16 ml-auto" />
                                    <Skeleton className="h-5 w-16 rounded-full ml-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}

const quickAccessItems = [
    {
        title: "Active Projects",
        icon: Briefcase,
        color: "bg-blue-500",
        href: "/dashboard/projects",
        statsKey: "activeProjects" as const,
    },
    {
        title: "Services",
        icon: Package,
        color: "bg-blue-500",
        href: "/dashboard/services",
        statsKey: "activeServices" as const,
    },
    {
        title: "Invoices",
        icon: Receipt,
        color: "bg-blue-500",
        href: "/dashboard/billing",
        statsKey: "pendingInvoices" as const,
    },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case "ACTIVE":
        case "ISSUED":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 font-normal">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Active
                </Badge>
            );
        case "OVERDUE":
            return (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1 font-normal">
                    <Warning weight="fill" className="w-3 h-3" />
                    Overdue
                </Badge>
            );
        case "PENDING":
            return (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1 font-normal">
                    <Warning weight="fill" className="w-3 h-3" />
                    Pending
                </Badge>
            );
        case "PAID":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 font-normal">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Paid
                </Badge>
            );
        case "SUSPENDED":
            return (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1 font-normal">
                    <XCircle weight="fill" className="w-3 h-3" />
                    Suspended
                </Badge>
            );
        default:
            return (
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 font-normal">
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
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

async function fetchDashboardStats(token: string): Promise<DashboardStats> {
    const response = await apiClient<DashboardStats>("/dashboard/stats", {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok || !response.data) {
        throw new Error('Failed to fetch dashboard');
    }
    return response.data;
}

export function DashboardContent({ token }: DashboardContentProps) {
    const { data, isLoading, error } = useQuery<DashboardStats>({
        queryKey: ['dashboard', 'stats', token],
        queryFn: () => fetchDashboardStats(token),
        retry: 2,
    });

    if (isLoading) {
        return <DashboardLoadingSkeleton />;
    }

    if (error || !data) {
        return (
            <div className="p-6">
                <Card className="border-0 shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Warning weight="duotone" className="w-12 h-12 text-amber-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Unable to load dashboard</h3>
                        <p className="text-muted-foreground">Please try refreshing the page.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const organizationName = data.organization?.name || data.user?.name || "Your Account";

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-8"
        >
            {/* Quick Access Section */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <DotsThree weight="bold" className="w-5 h-5 text-gray-500" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickAccessItems.map((item) => (
                        <Link key={item.title} href={item.href}>
                            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                <CardContent className="p-4">
                                    <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mb-3`}>
                                        <item.icon weight="fill" className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item.statsKey && data.stats[item.statsKey] !== undefined
                                            ? `${data.stats[item.statsKey]} items`
                                            : 'View all'}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Main Content Area */}
            <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-sm">
                    {/* Breadcrumb & Actions Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Home</span>
                            <CaretRight weight="bold" className="w-3 h-3 text-gray-400" />
                            <span className="font-medium text-gray-900">{organizationName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" className="gap-2" asChild>
                                <Link href="/dashboard/projects">
                                    <Plus weight="bold" className="w-4 h-4" />
                                    New Project
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Summary Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                        <div className="p-4 text-center">
                            <p className="text-2xl font-bold text-gray-900">{data.stats.activeProjects}</p>
                            <p className="text-sm text-gray-500">Active Projects</p>
                        </div>
                        <div className="p-4 text-center">
                            <p className="text-2xl font-bold text-gray-900">{data.stats.activeServices}</p>
                            <p className="text-sm text-gray-500">Active Services</p>
                        </div>
                        <div className="p-4 text-center">
                            <p className="text-2xl font-bold text-amber-600">{data.stats.pendingInvoices}</p>
                            <p className="text-sm text-gray-500">Pending Invoices</p>
                        </div>
                        <div className="p-4 text-center">
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.stats.totalSpent)}</p>
                            <p className="text-sm text-gray-500">Total Spent</p>
                        </div>
                    </div>

                    {/* Table-like listing */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Item</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500 hidden md:table-cell">Status</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500 hidden md:table-cell">Amount</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Due Date</th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentInvoices.length > 0 ? (
                                    data.recentInvoices.map((invoice) => (
                                        <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Receipt weight="fill" className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                                                        <p className="text-sm text-gray-500 md:hidden">{formatCurrency(invoice.amountDue)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                {getStatusBadge(invoice.status)}
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <span className="font-medium text-gray-900">{formatCurrency(invoice.amountDue)}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-gray-600">{invoice.dueAt ? formatDate(invoice.dueAt) : 'N/A'}</span>
                                            </td>
                                            <td className="p-4">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <DotsThree weight="bold" className="w-5 h-5 text-gray-400" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            <FolderSimple weight="duotone" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p className="font-medium text-gray-600">No pending invoices</p>
                                            <p className="text-sm">You&apos;re all caught up!</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* View All Footer */}
                    {data.recentInvoices.length > 0 && (
                        <div className="p-4 border-t border-gray-100">
                            <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/5" asChild>
                                <Link href="/dashboard/billing" className="gap-2">
                                    View all invoices
                                    <ArrowRight weight="bold" className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Pending Quotes Alert */}
            {data.stats.pendingQuotes > 0 && (
                <motion.div variants={itemVariants}>
                    <Card className="border-0 shadow-sm bg-blue-50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <Briefcase weight="fill" className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-blue-900">
                                            {data.stats.pendingQuotes} quote{data.stats.pendingQuotes > 1 ? 's' : ''} waiting for your response
                                        </p>
                                        <p className="text-sm text-blue-700">Review and approve to proceed with your projects</p>
                                    </div>
                                </div>
                                <Button size="sm" asChild>
                                    <Link href="/dashboard/projects">Review</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
}
