"use client";

import { useEffect, useState } from "react";
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

interface FinancialData {
    totalRevenue: number;
    monthlyRevenue: number;
    pendingPayments: number;
    overdue: number;
    recentTransactions: Array<{
        id: string;
        client: string;
        amount: number;
        status: "completed" | "pending" | "failed";
        date: Date;
        service: string;
    }>;
    monthlyData: Array<{
        month: string;
        revenue: number;
        expenses: number;
    }>;
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

export default function FinancialsPage() {
    const [data, setData] = useState<FinancialData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState("12m");

    useEffect(() => {
        setTimeout(() => {
            setData({
                totalRevenue: 245680.50,
                monthlyRevenue: 32450.00,
                pendingPayments: 8750.00,
                overdue: 2340.00,
                recentTransactions: [
                    { id: "1", client: "Acme Corp", amount: 299, status: "completed", date: new Date(), service: "SEO Pro" },
                    { id: "2", client: "Tech Solutions", amount: 2500, status: "completed", date: new Date(Date.now() - 86400000), service: "Website Dev" },
                    { id: "3", client: "Global Industries", amount: 499, status: "pending", date: new Date(Date.now() - 172800000), service: "Social Media" },
                    { id: "4", client: "StartupXYZ", amount: 199, status: "completed", date: new Date(Date.now() - 259200000), service: "Email Marketing" },
                    { id: "5", client: "Enterprise Ltd", amount: 1250, status: "failed", date: new Date(Date.now() - 345600000), service: "Cloud Hosting" },
                ],
                monthlyData: [
                    { month: "Jan", revenue: 28500, expenses: 12000 },
                    { month: "Feb", revenue: 31200, expenses: 13500 },
                    { month: "Mar", revenue: 29800, expenses: 11800 },
                    { month: "Apr", revenue: 35400, expenses: 14200 },
                    { month: "May", revenue: 38900, expenses: 15600 },
                    { month: "Jun", revenue: 32450, expenses: 13200 },
                ],
            });
            setIsLoading(false);
        }, 500);
    }, [period]);

    const maxRevenue = Math.max(...(data?.monthlyData.map(d => d.revenue) || [1]));

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
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Financials</h1>
                    <p className="text-gray-500 text-md mt-1">
                        Christus Veritas Technologies - Company financial overview and reports
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1m">Last Month</SelectItem>
                            <SelectItem value="3m">Last 3 Months</SelectItem>
                            <SelectItem value="6m">Last 6 Months</SelectItem>
                            <SelectItem value="12m">Last 12 Months</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
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
                                    ${data?.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">This Month</p>
                                <p className="text-3xl font-bold mt-1">
                                    ${data?.monthlyRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm">Pending</p>
                                <p className="text-3xl font-bold mt-1">
                                    ${data?.pendingPayments.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm">Overdue</p>
                                <p className="text-3xl font-bold mt-1">
                                    ${data?.overdue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Charts and Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Revenue Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data?.monthlyData.map((month, index) => (
                                    <motion.div
                                        key={month.month}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.05 }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{month.month}</span>
                                            <span className="text-sm text-gray-500">${month.revenue.toLocaleString()}</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-premium-purple to-royal-blue rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                                                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Recent Transactions</CardTitle>
                            <Button variant="ghost" size="sm">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data?.recentTransactions.map((tx, index) => (
                                    <motion.div
                                        key={tx.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.status === "completed" ? "bg-green-100" :
                                                    tx.status === "pending" ? "bg-yellow-100" : "bg-red-100"
                                                }`}>
                                                <svg className={`w-5 h-5 ${tx.status === "completed" ? "text-green-600" :
                                                        tx.status === "pending" ? "text-yellow-600" : "text-red-600"
                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {tx.status === "completed" ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    ) : tx.status === "pending" ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    )}
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{tx.client}</p>
                                                <p className="text-xs text-gray-500">{tx.service}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${tx.status === "completed" ? "text-green-600" :
                                                    tx.status === "pending" ? "text-yellow-600" : "text-red-600"
                                                }`}>
                                                ${tx.amount.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(tx.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
