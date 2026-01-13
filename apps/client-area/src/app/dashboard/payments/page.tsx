"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    CreditCard,
    CurrencyDollar,
    CheckCircle,
    Download,
    Receipt,
    CalendarBlank,
    ArrowUpRight,
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
const payments = [
    {
        id: "PAY-2026-001",
        date: "January 10, 2026",
        amount: 299.99,
        method: "Paynow - Ecocash",
        reference: "PAYNOW-EC-123456",
        invoiceId: "INV-2026-001",
        status: "COMPLETED" as const,
    },
    {
        id: "PAY-2025-012",
        date: "December 12, 2025",
        amount: 299.99,
        method: "Paynow - Bank Transfer",
        reference: "PAYNOW-BT-654321",
        invoiceId: "INV-2025-012",
        status: "COMPLETED" as const,
    },
    {
        id: "PAY-2025-011",
        date: "November 10, 2025",
        amount: 299.99,
        method: "Paynow - Ecocash",
        reference: "PAYNOW-EC-789012",
        invoiceId: "INV-2025-011",
        status: "COMPLETED" as const,
    },
    {
        id: "PAY-2025-010",
        date: "October 8, 2025",
        amount: 299.99,
        method: "Paynow - Innbucks",
        reference: "PAYNOW-IB-345678",
        invoiceId: "INV-2025-010",
        status: "COMPLETED" as const,
    },
];

const paymentSummary = {
    totalPaid: 1199.96,
    paymentsThisYear: 2,
    lastPaymentDate: "January 10, 2026",
    preferredMethod: "Paynow - Ecocash",
};

const getStatusBadge = (status: "COMPLETED" | "PENDING" | "FAILED") => {
    switch (status) {
        case "COMPLETED":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Completed
                </Badge>
            );
        case "PENDING":
            return (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1">
                    Pending
                </Badge>
            );
        case "FAILED":
            return (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
                    Failed
                </Badge>
            );
    }
};

export default function PaymentsPage() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
                <p className="text-muted-foreground mt-1">
                    View all your past payments and download receipts
                </p>
            </motion.div>

            {/* Summary Cards */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <CurrencyDollar weight="duotone" className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Paid</p>
                                <p className="text-2xl font-bold">${paymentSummary.totalPaid.toFixed(2)}</p>
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
                                <p className="text-sm text-muted-foreground">Payments (2026)</p>
                                <p className="text-2xl font-bold">{paymentSummary.paymentsThisYear}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <CalendarBlank weight="duotone" className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Last Payment</p>
                                <p className="text-lg font-semibold">{paymentSummary.lastPaymentDate}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <CreditCard weight="duotone" className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Preferred Method</p>
                                <p className="text-base font-semibold">{paymentSummary.preferredMethod}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Payments Table */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>All Payments</CardTitle>
                        <CardDescription>
                            Complete history of all your payments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payment ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">{payment.id}</TableCell>
                                        <TableCell>{payment.date}</TableCell>
                                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                        <TableCell>{payment.method}</TableCell>
                                        <TableCell>
                                            <Button variant="link" className="p-0 h-auto text-primary gap-1">
                                                {payment.invoiceId}
                                                <ArrowUpRight className="w-3 h-3" />
                                            </Button>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="gap-1">
                                                <Download weight="regular" className="w-4 h-4" />
                                                Receipt
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Payment Info */}
            <motion.div variants={itemVariants}>
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <CreditCard weight="duotone" className="w-8 h-8 text-primary flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                                <p className="text-sm text-muted-foreground">
                                    All payments are processed securely through Paynow. We accept Ecocash, 
                                    OneMoney, Innbucks, and bank transfers. For any payment issues or 
                                    refund requests, please contact our support team.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
