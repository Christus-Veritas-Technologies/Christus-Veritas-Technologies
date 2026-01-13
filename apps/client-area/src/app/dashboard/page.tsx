"use client";

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
} from "@phosphor-icons/react";
import Link from "next/link";

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

// Mock data - replace with real API calls
const accountData = {
    organizationName: "Acme Corporation Ltd",
    status: "ACTIVE" as "ACTIVE" | "OVERDUE" | "SUSPENDED",
    currentBalance: 299.99,
    nextInvoiceDate: "February 1, 2026",
    posSystemStatus: "ONLINE",
};

const recentNotifications = [
    { id: 1, type: "payment", title: "Payment Received", message: "Payment of $299.99 confirmed", date: "2 hours ago" },
    { id: 2, type: "invoice", title: "New Invoice", message: "Invoice #INV-2026-002 generated", date: "1 day ago" },
    { id: 3, type: "service", title: "Service Active", message: "POS System is running smoothly", date: "2 days ago" },
    { id: 4, type: "maintenance", title: "Scheduled Maintenance", message: "System maintenance on Jan 20", date: "3 days ago" },
    { id: 5, type: "info", title: "Welcome!", message: "Your account setup is complete", date: "5 days ago" },
];

const getStatusBadge = (status: "ACTIVE" | "OVERDUE" | "SUSPENDED") => {
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
    }
};

export default function ClientDashboardPage() {
    const isOverdue = accountData.status === "OVERDUE";

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
                        <h1 className="text-2xl font-bold text-gray-900">{accountData.organizationName}</h1>
                        {getStatusBadge(accountData.status)}
                    </div>
                    <p className="text-muted-foreground">
                        Dashboard Overview
                    </p>
                </div>
                {isOverdue && (
                    <Button className="bg-amber-500 hover:bg-amber-600 gap-2">
                        <CreditCard weight="bold" className="w-4 h-4" />
                        Pay Now
                    </Button>
                )}
            </motion.div>

            {/* Account Status Cards */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Account Status */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Buildings weight="duotone" className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Account Status</p>
                                <div className="mt-1">
                                    {getStatusBadge(accountData.status)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Current Balance */}
                <Card className={isOverdue ? "border-amber-200 bg-amber-50/50" : ""}>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isOverdue ? "bg-amber-100" : "bg-green-100"
                                }`}>
                                <CurrencyDollar weight="duotone" className={`w-6 h-6 ${isOverdue ? "text-amber-600" : "text-green-600"
                                    }`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Current Balance</p>
                                <p className={`text-2xl font-bold ${isOverdue ? "text-amber-600" : ""
                                    }`}>
                                    ${accountData.currentBalance.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Next Invoice */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <CalendarBlank weight="duotone" className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Next Invoice</p>
                                <p className="text-lg font-semibold">{accountData.nextInvoiceDate}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* POS Status */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <CheckCircle weight="duotone" className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">POS System</p>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                    {accountData.posSystemStatus}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Actions & Recent Notifications */}
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
                                        <Buildings weight="regular" className="w-4 h-4" />
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

                {/* Recent Notifications */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Notifications</CardTitle>
                                    <CardDescription>
                                        Latest updates on your account
                                    </CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/dashboard/notifications">View All</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentNotifications.map((notification) => (
                                    <div key={notification.id} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {notification.date}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
