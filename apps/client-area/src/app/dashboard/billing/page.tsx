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
import { Skeleton } from "@/components/ui/skeleton";
import { useInvoices, useDashboardStats, Invoice } from "@/lib/api";

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

function BillingLoadingSkeleton() {
    return (
        <div className="p-6 space-y-6">
            {/* Header skeleton */}
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Summary cards skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-7 w-20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Invoice table skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-36 mb-1" />
                    <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Table header */}
                        <div className="grid grid-cols-6 gap-4 pb-2 border-b">
                            {['Invoice', 'Date', 'Amount', 'Status', 'Due Date', 'Actions'].map((_, i) => (
                                <Skeleton key={i} className="h-4 w-16" />
                            ))}
                        </div>
                        {/* Table rows */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="grid grid-cols-6 gap-4 py-3">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-8 w-16 ml-auto" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "PAID":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Paid
                </Badge>
            );
        case "ISSUED":
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
        case "PARTIAL":
            return (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1">
                    <Clock weight="fill" className="w-3 h-3" />
                    Partial
                </Badge>
            );
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function BillingPage() {
    const { data: invoices, isLoading, error } = useInvoices();
    const { data: stats } = useDashboardStats();
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const pendingInvoices = invoices?.filter(inv => ["ISSUED", "PENDING", "OVERDUE", "PARTIAL"].includes(inv.status)) || [];
    const hasPendingPayments = pendingInvoices.length > 0;

    // Calculate summary from invoices
    const currentBalance = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = invoices?.filter(inv => inv.status === "PAID").reduce((sum, inv) => sum + inv.amount, 0) || 0;
    const lastPaidInvoice = invoices?.find(inv => inv.status === "PAID" && inv.paidAt);

    const openInvoiceDetail = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsDetailOpen(true);
    };

    if (isLoading) {
        return <BillingLoadingSkeleton />;
    }

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
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${hasPendingPayments ? "bg-amber-100" : "bg-green-100"}`}>
                                <CurrencyDollar weight="duotone" className={`w-6 h-6 ${hasPendingPayments ? "text-amber-600" : "text-green-600"}`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Amount Due</p>
                                <p className={`text-2xl font-bold ${hasPendingPayments ? "text-amber-600" : ""}`}>
                                    ${(currentBalance / 100).toFixed(2)}
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
                                <p className="text-sm text-muted-foreground">Pending Invoices</p>
                                <p className="text-2xl font-bold">{pendingInvoices.length}</p>
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
                                <p className="text-sm text-muted-foreground">Total Paid</p>
                                <p className="text-lg font-semibold">${(totalPaid / 100).toFixed(2)}</p>
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
                                <p className="text-2xl font-bold">{invoices?.length || 0}</p>
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
                                            Total: ${(pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0) / 100).toFixed(2)}
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
                        {error ? (
                            <div className="flex flex-col items-center justify-center py-8 text-red-600">
                                <Warning weight="duotone" className="w-8 h-8 mb-2" />
                                <p>Failed to load invoices</p>
                            </div>
                        ) : invoices && invoices.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                            <TableCell>
                                                {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell>${(invoice.amount / 100).toFixed(2)}</TableCell>
                                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                            <TableCell>
                                                {invoice.dueDate
                                                    ? new Date(invoice.dueDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })
                                                    : "-"}
                                            </TableCell>
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
                                                    {["ISSUED", "PENDING", "OVERDUE", "PARTIAL"].includes(invoice.status) && (
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
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Receipt weight="duotone" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No invoices yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Invoice Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Invoice {selectedInvoice?.invoiceNumber}</DialogTitle>
                        <DialogDescription>
                            Invoice details
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
                                    <p className="font-medium">
                                        {selectedInvoice.dueDate
                                            ? new Date(selectedInvoice.dueDate).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                            : "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Invoice Date</p>
                                    <p className="font-medium">
                                        {new Date(selectedInvoice.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                {selectedInvoice.paidAt && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Paid Date</p>
                                        <p className="font-medium">
                                            {new Date(selectedInvoice.paidAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Line Items */}
                            {selectedInvoice.items && selectedInvoice.items.length > 0 && (
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
                                            {selectedInvoice.items.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.description}</TableCell>
                                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                                    <TableCell className="text-right">${(item.unitPrice / 100).toFixed(2)}</TableCell>
                                                    <TableCell className="text-right">${(item.total / 100).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {/* Total */}
                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="text-lg font-semibold">Total Amount</span>
                                <span className="text-2xl font-bold">${(selectedInvoice.amount / 100).toFixed(2)}</span>
                            </div>

                            {/* Pay Button */}
                            {["ISSUED", "PENDING", "OVERDUE", "PARTIAL"].includes(selectedInvoice.status) && (
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
