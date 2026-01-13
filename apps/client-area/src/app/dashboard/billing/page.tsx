"use client";

import { useState } from "react";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    CurrencyDollar,
    Receipt,
    Clock,
    CheckCircle,
    Eye,
    CreditCard,
    Warning,
    CalendarBlank,
    ArrowRight,
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
const billingData = {
    currentBalance: 299.99,
    nextInvoiceDate: "February 1, 2026",
    lastPaymentDate: "January 1, 2026",
    lastPaymentAmount: 299.99,
};

const invoices = [
    {
        id: "INV-2026-001",
        period: "January 2026",
        amount: 299.99,
        status: "PAID" as const,
        dueDate: "January 15, 2026",
        paidDate: "January 10, 2026",
        lineItems: [
            { description: "POS System - Monthly Maintenance", quantity: 1, unitPrice: 299.99, total: 299.99 },
        ],
    },
    {
        id: "INV-2026-002",
        period: "February 2026",
        amount: 299.99,
        status: "PENDING" as const,
        dueDate: "February 15, 2026",
        paidDate: null,
        lineItems: [
            { description: "POS System - Monthly Maintenance", quantity: 1, unitPrice: 299.99, total: 299.99 },
        ],
    },
    {
        id: "INV-2025-012",
        period: "December 2025",
        amount: 299.99,
        status: "PAID" as const,
        dueDate: "December 15, 2025",
        paidDate: "December 12, 2025",
        lineItems: [
            { description: "POS System - Monthly Maintenance", quantity: 1, unitPrice: 299.99, total: 299.99 },
        ],
    },
    {
        id: "INV-2025-011",
        period: "November 2025",
        amount: 299.99,
        status: "PAID" as const,
        dueDate: "November 15, 2025",
        paidDate: "November 10, 2025",
        lineItems: [
            { description: "POS System - Monthly Maintenance", quantity: 1, unitPrice: 299.99, total: 299.99 },
        ],
    },
];

type Invoice = typeof invoices[0];

const getStatusBadge = (status: "PAID" | "PENDING" | "OVERDUE") => {
    switch (status) {
        case "PAID":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Paid
                </Badge>
            );
        case "PENDING":
            return (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1">
                    <Clock weight="fill" className="w-3 h-3" />
                    Pending
                </Badge>
            );
        case "OVERDUE":
            return (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
                    <Warning weight="fill" className="w-3 h-3" />
                    Overdue
                </Badge>
            );
    }
};

export default function BillingPage() {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const pendingInvoices = invoices.filter(inv => inv.status === "PENDING");
    const hasPendingPayments = pendingInvoices.length > 0;

    const openInvoiceDetail = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsDetailOpen(true);
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
                <p className="text-muted-foreground mt-1">
                    View your invoices and manage payments
                </p>
            </motion.div>

            {/* Summary Cards */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Current Balance */}
                <Card className={hasPendingPayments ? "border-amber-200 bg-amber-50/50" : ""}>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${hasPendingPayments ? "bg-amber-100" : "bg-green-100"
                                }`}>
                                <CurrencyDollar weight="duotone" className={`w-6 h-6 ${hasPendingPayments ? "text-amber-600" : "text-green-600"
                                    }`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Current Balance</p>
                                <p className={`text-2xl font-bold ${hasPendingPayments ? "text-amber-600" : ""
                                    }`}>
                                    ${billingData.currentBalance.toFixed(2)}
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
                                <p className="text-lg font-semibold">{billingData.nextInvoiceDate}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Last Payment */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <CheckCircle weight="duotone" className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Last Payment</p>
                                <p className="text-lg font-semibold">${billingData.lastPaymentAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Invoices */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Receipt weight="duotone" className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Invoices</p>
                                <p className="text-2xl font-bold">{invoices.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Pending Payment Alert */}
            {hasPendingPayments && (
                <motion.div variants={itemVariants}>
                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Warning weight="fill" className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="font-medium text-amber-800">
                                            You have {pendingInvoices.length} pending invoice{pendingInvoices.length > 1 ? "s" : ""}
                                        </p>
                                        <p className="text-sm text-amber-700">
                                            Total: ${pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <Button className="bg-amber-500 hover:bg-amber-600 gap-2">
                                    <CreditCard weight="bold" className="w-4 h-4" />
                                    Pay with Paynow
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Invoices Table */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice History</CardTitle>
                        <CardDescription>
                            All your invoices and their payment status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice ID</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.id}</TableCell>
                                        <TableCell>{invoice.period}</TableCell>
                                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                        <TableCell>{invoice.dueDate}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openInvoiceDetail(invoice)}
                                                >
                                                    <Eye weight="regular" className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                                {invoice.status === "PENDING" && (
                                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                                        Pay
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Invoice Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Invoice {selectedInvoice?.id}</DialogTitle>
                        <DialogDescription>
                            Invoice details for {selectedInvoice?.period}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedInvoice && (
                        <div className="space-y-6">
                            {/* Invoice Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Due Date</p>
                                    <p className="font-medium">{selectedInvoice.dueDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Invoice Period</p>
                                    <p className="font-medium">{selectedInvoice.period}</p>
                                </div>
                                {selectedInvoice.paidDate && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Paid Date</p>
                                        <p className="font-medium">{selectedInvoice.paidDate}</p>
                                    </div>
                                )}
                            </div>

                            {/* Line Items */}
                            <div>
                                <h4 className="font-medium mb-3">Line Items</h4>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right">Unit Price</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedInvoice.lineItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="text-lg font-semibold">Total Amount</span>
                                <span className="text-2xl font-bold">${selectedInvoice.amount.toFixed(2)}</span>
                            </div>

                            {/* Pay Button */}
                            {selectedInvoice.status === "PENDING" && (
                                <Button className="w-full bg-primary hover:bg-primary/90 gap-2">
                                    <CreditCard weight="bold" className="w-4 h-4" />
                                    Pay with Paynow
                                </Button>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
