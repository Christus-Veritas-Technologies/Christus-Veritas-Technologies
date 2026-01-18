"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Area,
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Bar,
    BarChart,
} from "recharts";
import {
    CurrencyDollar,
    TrendUp,
    Clock,
    Warning,
    Download,
    CaretLeft,
    CaretRight,
    Spinner,
    CheckCircle,
    XCircle,
    Hourglass,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { PageContainer } from "@/components/page-container";

interface RevenueData {
    totalRevenue: number;
    periodRevenue: number;
    periodData: Array<{
        date: string;
        amount: number;
    }>;
    paymentMethodBreakdown: Array<{
        method: string;
        total: number;
        count: number;
    }>;
}

interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    paynowReference: string | null;
    pollUrl: string | null;
    createdAt: string;
    updatedAt: string;
    order: {
        id: string;
        user: {
            id: string;
            name: string | null;
            email: string;
        };
    } | null;
}

interface PaymentsResponse {
    payments: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const chartConfig = {
    amount: {
        label: "Revenue",
        color: "hsl(var(--chart-1))",
    },
};

export default function FinancialsPage() {
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<"week" | "month" | "year">("month");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPayments, setTotalPayments] = useState(0);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [pendingCount, setPendingCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    const fetchRevenueData = useCallback(async () => {
        try {
            const response = await fetch(
                `${API_BASE}/api/admin/analytics/revenue?period=${period}`,
                { credentials: "include" }
            );

            if (!response.ok) throw new Error("Failed to fetch revenue data");

            const data = await response.json();
            setRevenueData(data);
        } catch (error) {
            console.error("Error fetching revenue data:", error);
            toast.error("Failed to load revenue data.");
        }
    }, [period]);

    const fetchPayments = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });
            if (statusFilter !== "all") {
                params.append("status", statusFilter);
            }

            const response = await fetch(
                `${API_BASE}/api/admin/payments?${params}`,
                { credentials: "include" }
            );

            if (!response.ok) throw new Error("Failed to fetch payments");

            const data: PaymentsResponse = await response.json();
            setPayments(data.payments);
            setTotalPages(data.totalPages);
            setTotalPayments(data.total);

            // Calculate stats from payments
            const pending = data.payments.filter(p => p.status === "PENDING").length;
            const completed = data.payments.filter(p => p.status === "COMPLETED").length;
            setPendingCount(pending);
            setCompletedCount(completed);
        } catch (error) {
            console.error("Error fetching payments:", error);
            toast.error("Failed to load payments.");
        }
    }, [page, statusFilter]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchRevenueData(), fetchPayments()]);
            setIsLoading(false);
        };
        loadData();
    }, [fetchRevenueData, fetchPayments]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />;
            case "PENDING":
                return <Hourglass className="w-4 h-4 text-yellow-600" weight="fill" />;
            case "FAILED":
                return <XCircle className="w-4 h-4 text-red-600" weight="fill" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" weight="fill" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "FAILED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-64 bg-gray-200 rounded" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
                        ))}
                    </div>
                    <div className="h-80 bg-gray-200 rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <PageContainer>
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Financials</h1>
                    <p className="text-gray-500 text-md mt-1">
                        Company financial overview and reports
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Select 
                        value={period} 
                        onValueChange={(value: "week" | "month" | "year") => setPeriod(value)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">Last Week</SelectItem>
                            <SelectItem value="month">Last Month</SelectItem>
                            <SelectItem value="year">Last Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Total Revenue</p>
                                <p className="text-3xl font-bold mt-1">
                                    {formatCurrency(revenueData?.totalRevenue || 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                                <CurrencyDollar className="w-6 h-6" weight="bold" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Period Revenue</p>
                                <p className="text-3xl font-bold mt-1">
                                    {formatCurrency(revenueData?.periodRevenue || 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                                <TrendUp className="w-6 h-6" weight="bold" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm">Pending Payments</p>
                                <p className="text-3xl font-bold mt-1">{pendingCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                                <Clock className="w-6 h-6" weight="bold" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Total Payments</p>
                                <p className="text-3xl font-bold mt-1">{totalPayments}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6" weight="bold" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {revenueData?.periodData && revenueData.periodData.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={revenueData.periodData}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis 
                                                dataKey="date" 
                                                tickFormatter={(value) => {
                                                    const date = new Date(value);
                                                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                                }}
                                                className="text-xs"
                                            />
                                            <YAxis 
                                                tickFormatter={(value) => `$${value}`}
                                                className="text-xs"
                                            />
                                            <ChartTooltip 
                                                content={<ChartTooltipContent />}
                                                formatter={(value: number) => formatCurrency(value)}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="hsl(var(--primary))"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-gray-500">
                                    No revenue data for this period
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Payment Methods Breakdown */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payment Methods</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {revenueData?.paymentMethodBreakdown && revenueData.paymentMethodBreakdown.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={revenueData.paymentMethodBreakdown}
                                            layout="vertical"
                                            margin={{ top: 10, right: 10, left: 60, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                                            <YAxis 
                                                type="category" 
                                                dataKey="method" 
                                                className="text-xs"
                                            />
                                            <ChartTooltip 
                                                content={<ChartTooltipContent />}
                                                formatter={(value: number) => formatCurrency(value)}
                                            />
                                            <Bar
                                                dataKey="total"
                                                fill="hsl(var(--secondary))"
                                                radius={[0, 4, 4, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-gray-500">
                                    No payment method data available
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Payments Table */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Recent Payments</CardTitle>
                        <Select 
                            value={statusFilter} 
                            onValueChange={(value) => {
                                setStatusFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No payments found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {payment.order?.user?.name || "Unknown"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {payment.order?.user?.email || "N/A"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(payment.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <span className="capitalize">{payment.method.toLowerCase()}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                    {getStatusIcon(payment.status)}
                                                    {payment.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-500 font-mono text-xs">
                                                {payment.paynowReference || "—"}
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <p className="text-sm text-gray-500">
                                    Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, totalPayments)} of {totalPayments} payments
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        <CaretLeft className="w-4 h-4" />
                                        Previous
                                    </Button>
                                    <span className="text-sm text-gray-600 px-2">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        Next
                                        <CaretRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </PageContainer>
    );
}
