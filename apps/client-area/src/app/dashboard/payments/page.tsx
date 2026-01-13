"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CreditCard,
    Receipt,
    Clock,
    CheckCircle,
    Download,
    ArrowRight,
} from "@phosphor-icons/react";

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
const invoices = [
    {
        id: "INV-001",
        description: "Professional Web Hosting - February 2026",
        amount: "$29.99",
        status: "PENDING",
        dueDate: "Feb 1, 2026",
        createdAt: "Jan 15, 2026",
    },
    {
        id: "INV-002",
        description: "SSL Certificate Renewal",
        amount: "$99.99",
        status: "PAID",
        dueDate: "Jan 15, 2026",
        createdAt: "Jan 1, 2026",
        paidAt: "Jan 10, 2026",
    },
    {
        id: "INV-003",
        description: "Cloud Backup - January 2026",
        amount: "$19.99",
        status: "PAID",
        dueDate: "Jan 1, 2026",
        createdAt: "Dec 15, 2025",
        paidAt: "Dec 28, 2025",
    },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case "PAID":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
        case "PENDING":
            return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
        case "OVERDUE":
            return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Overdue</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function PaymentsPage() {
    const pendingAmount = invoices
        .filter(inv => inv.status === "PENDING")
        .reduce((sum, inv) => sum + parseFloat(inv.amount.replace("$", "")), 0);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-gray-900">Payments & Invoices</h1>
                <p className="text-muted-foreground mt-1">
                    View your invoices and manage payments
                </p>
            </motion.div>

            {/* Summary Cards */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <Clock weight="duotone" className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">${pendingAmount.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">Pending Amount</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <CheckCircle weight="duotone" className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {invoices.filter(inv => inv.status === "PAID").length}
                                </p>
                                <p className="text-sm text-muted-foreground">Paid Invoices</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Receipt weight="duotone" className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{invoices.length}</p>
                                <p className="text-sm text-muted-foreground">Total Invoices</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Invoices List */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>
                            Your billing history and pending invoices
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {invoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${invoice.status === "PAID" ? "bg-green-100" : "bg-yellow-100"
                                            }`}>
                                            {invoice.status === "PAID" ? (
                                                <CheckCircle weight="duotone" className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Clock weight="duotone" className="w-5 h-5 text-yellow-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{invoice.description}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {invoice.id} • Due {invoice.dueDate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-semibold">{invoice.amount}</p>
                                            {getStatusBadge(invoice.status)}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Download weight="regular" className="w-4 h-4" />
                                            </Button>
                                            {invoice.status === "PENDING" && (
                                                <Button size="sm" className="bg-primary hover:bg-primary/90">
                                                    Pay Now
                                                    <ArrowRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Payment Methods */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Payment Methods</CardTitle>
                                <CardDescription>
                                    Manage your saved payment methods
                                </CardDescription>
                            </div>
                            <Button variant="outline">
                                <CreditCard weight="regular" className="w-4 h-4 mr-2" />
                                Add Payment Method
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 p-4 rounded-lg border">
                            <div className="w-12 h-8 bg-linear-to-r from-primary to-secondary rounded flex items-center justify-center">
                                <CreditCard weight="fill" className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">•••• •••• •••• 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 12/27</p>
                            </div>
                            <Badge variant="secondary">Default</Badge>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
