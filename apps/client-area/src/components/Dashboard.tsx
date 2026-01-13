"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <header className="bg-background border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-premium-purple rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="text-lg font-semibold text-foreground">CVT Client Portal</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </Button>
                            <div className="w-8 h-8 bg-royal-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                                JD
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back!</h1>
                    <p className="text-muted-foreground mb-8">Here&apos;s what&apos;s happening with your projects.</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Active Projects", value: "3", icon: "📁", color: "bg-blue-50 text-blue-600" },
                        { label: "Pending Invoices", value: "2", icon: "📄", color: "bg-yellow-50 text-yellow-600" },
                        { label: "Support Tickets", value: "1", icon: "🎫", color: "bg-purple-50 text-purple-600" },
                        { label: "Total Spent", value: "$4,250", icon: "💰", color: "bg-green-50 text-green-600" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.5 }}
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-xl mb-4`}>
                                        {stat.icon}
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "View Projects", icon: "📁" },
                                    { label: "Pay Invoice", icon: "💳" },
                                    { label: "New Ticket", icon: "🎫" },
                                    { label: "Contact Us", icon: "✉️" },
                                ].map((action) => (
                                    <Button
                                        key={action.label}
                                        variant="outline"
                                        className="flex flex-col items-center gap-2 h-auto py-4 hover:border-premium-purple hover:bg-purple-50"
                                    >
                                        <span className="text-2xl">{action.icon}</span>
                                        <span className="text-sm font-medium">{action.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
