"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Package,
    CreditCard,
    Clock,
    ArrowRight,
    CheckCircle,
    Bell,
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

export default function ClientDashboardPage() {
    // Mock data - replace with real API calls
    const stats = {
        activeServices: 3,
        pendingPayments: 1,
        upcomingRenewals: 2,
    };

    const recentActivity = [
        { id: 1, type: "payment", message: "Payment received for Web Hosting", date: "2 hours ago" },
        { id: 2, type: "service", message: "SSL Certificate renewed", date: "1 day ago" },
        { id: 3, type: "notification", message: "New invoice generated", date: "3 days ago" },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Welcome Section */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome to your client portal. Here&apos;s an overview of your account.
                </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Package weight="duotone" className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.activeServices}</p>
                                <p className="text-sm text-muted-foreground">Active Services</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <CreditCard weight="duotone" className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.pendingPayments}</p>
                                <p className="text-sm text-muted-foreground">Pending Payments</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Clock weight="duotone" className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.upcomingRenewals}</p>
                                <p className="text-sm text-muted-foreground">Upcoming Renewals</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Quick Actions */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common tasks you can perform
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-between group hover:border-primary"
                                asChild
                            >
                                <Link href="/dashboard/services">
                                    <span className="flex items-center gap-2">
                                        <Package weight="regular" className="w-4 h-4" />
                                        View My Services
                                    </span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-between group hover:border-primary"
                                asChild
                            >
                                <Link href="/dashboard/payments">
                                    <span className="flex items-center gap-2">
                                        <CreditCard weight="regular" className="w-4 h-4" />
                                        Make a Payment
                                    </span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-between group hover:border-primary"
                                asChild
                            >
                                <Link href="/dashboard/account">
                                    <span className="flex items-center gap-2">
                                        <CheckCircle weight="regular" className="w-4 h-4" />
                                        Update Account Details
                                    </span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest updates on your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'payment' ? 'bg-green-100' :
                                                activity.type === 'service' ? 'bg-primary/10' :
                                                    'bg-secondary/10'
                                            }`}>
                                            {activity.type === 'payment' && (
                                                <CreditCard weight="fill" className="w-4 h-4 text-green-600" />
                                            )}
                                            {activity.type === 'service' && (
                                                <Package weight="fill" className="w-4 h-4 text-primary" />
                                            )}
                                            {activity.type === 'notification' && (
                                                <Bell weight="fill" className="w-4 h-4 text-secondary" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {activity.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.date}
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
