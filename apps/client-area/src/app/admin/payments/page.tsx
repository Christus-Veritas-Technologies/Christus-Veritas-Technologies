"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    CreditCard,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    CaretLeft,
    CaretRight,
    CurrencyDollar,
    Receipt,
    DeviceMobile,
    Bank,
} from "@phosphor-icons/react";
import { apiClientWithAuth } from "@/lib/api-client";

interface Payment {
    id: string;
    amount: number;
    currency: string;
    method: string;
    status: string;
    externalId: string | null;
    externalStatus: string | null;
    initiatedAt: string;
    completedAt: string | null;
    failedAt: string | null;
    errorMessage: string | null;
    createdAt: string;
    invoice: {
        invoiceNumber: string;
    } | null;
    billingAccount: {
        organization: {
            name: string;
            email: string;
        };
    } | null;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

interface RevenueData {
    chartData: Array<{ date: string; amount: number; count: number }>;
    methodBreakdown: Record<string, number>;
    totalRevenue: number;
    totalTransactions: number;
}

const statusColors: Record<string, string> = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-700",
};

const methodIcons: Record<string, React.ReactNode> = {
    PAYNOW_ECOCASH: <DeviceMobile className="w-4 h-4" />,
    PAYNOW_ONEMONEY: <DeviceMobile className="w-4 h-4" />,
    PAYNOW_INNBUCKS: <DeviceMobile className="w-4 h-4" />,
    PAYNOW_VISA: <CreditCard className="w-4 h-4" />,
    PAYNOW_MASTERCARD: <CreditCard className="w-4 h-4" />,
    BANK_TRANSFER: <Bank className="w-4 h-4" />,
    CASH: <CurrencyDollar className="w-4 h-4" />,
    CREDIT: <Receipt className="w-4 h-4" />,
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [methodFilter, setMethodFilter] = useState<string>("all");
    const [period, setPeriod] = useState<string>("month");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchPayments = async (page = 1) => {
        try {
            setIsLoading(true);

            const params = new URLSearchParams({ page: page.toString(), limit: "20" });
            if (statusFilter !== "all") params.append("status", statusFilter);
            if (methodFilter !== "all") params.append("method", methodFilter);

            const response = await apiClientWithAuth<{ payments: Payment[]; pagination: Pagination }>(
                `/admin/payments?${params}`
            );

            if (response.ok && response.data) {
                setPayments(response.data.payments);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRevenueData = async () => {
        try {
            const response = await apiClientWithAuth<RevenueData>(
                `/admin/analytics/revenue?period=${period}`
            );

            if (response.ok && response.data) {
                setRevenueData(response.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [statusFilter, methodFilter]);

    useEffect(() => {
        fetchRevenueData();
    }, [period]);

    const openPaymentDetails = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatMethod = (method: string) => {
        return method.replace(/_/g, " ").replace("PAYNOW ", "");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Payments</h1>
                    <p className="text-muted-foreground">
                        Track and manage all payment transactions
                    </p>
                </div>
            </div>

            {/* Revenue Stats */}
            {revenueData && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CurrencyDollar className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                                    <p className="text-2xl font-bold">
                                        ${revenueData.totalRevenue.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Receipt className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Transactions</p>
                                    <p className="text-2xl font-bold">
                                        {revenueData.totalTransactions}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground mb-2">By Payment Method</p>
                            <div className="flex flex-wrap gap-3">
                                {Object.entries(revenueData.methodBreakdown).map(([method, amount]) => (
                                    <div
                                        key={method}
                                        className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"
                                    >
                                        {methodIcons[method] || <CreditCard className="w-4 h-4" />}
                                        <span className="text-sm font-medium">
                                            {formatMethod(method)}: ${amount.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters and Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Payment History</CardTitle>
                            <CardDescription>
                                All payment transactions on the platform
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="FAILED">Failed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction</TableHead>
                                <TableHead>Organization</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(7)].map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : payments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground">No payments found</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium font-mono text-sm">
                                                    {payment.externalId || payment.id.slice(0, 8)}
                                                </p>
                                                {payment.invoice && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Invoice: {payment.invoice.invoiceNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {payment.billingAccount?.organization ? (
                                                <div>
                                                    <p className="text-sm">
                                                        {payment.billingAccount.organization.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {payment.billingAccount.organization.email}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {methodIcons[payment.method] || (
                                                    <CreditCard className="w-4 h-4" />
                                                )}
                                                <span className="text-sm">
                                                    {formatMethod(payment.method)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">
                                                ${(payment.amount / 100).toFixed(2)}
                                            </span>
                                            <span className="text-xs text-muted-foreground ml-1">
                                                {payment.currency}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[payment.status]}>
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">
                                                {formatDate(payment.createdAt)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openPaymentDetails(payment)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                                {pagination.total}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchPayments(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                >
                                    <CaretLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchPayments(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.pages}
                                >
                                    <CaretRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    {selectedPayment && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Payment Details</DialogTitle>
                                <DialogDescription>
                                    Transaction {selectedPayment.externalId || selectedPayment.id}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge className={statusColors[selectedPayment.status]}>
                                        {selectedPayment.status}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-bold text-lg">
                                        ${(selectedPayment.amount / 100).toFixed(2)}{" "}
                                        {selectedPayment.currency}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Method</span>
                                    <div className="flex items-center gap-2">
                                        {methodIcons[selectedPayment.method]}
                                        <span>{formatMethod(selectedPayment.method)}</span>
                                    </div>
                                </div>

                                {selectedPayment.invoice && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Invoice</span>
                                        <span>{selectedPayment.invoice.invoiceNumber}</span>
                                    </div>
                                )}

                                {selectedPayment.billingAccount?.organization && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Organization</span>
                                        <span>{selectedPayment.billingAccount.organization.name}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Initiated</span>
                                    <span>{formatDate(selectedPayment.initiatedAt)}</span>
                                </div>

                                {selectedPayment.completedAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Completed</span>
                                        <span>{formatDate(selectedPayment.completedAt)}</span>
                                    </div>
                                )}

                                {selectedPayment.failedAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Failed</span>
                                        <span className="text-red-600">
                                            {formatDate(selectedPayment.failedAt)}
                                        </span>
                                    </div>
                                )}

                                {selectedPayment.errorMessage && (
                                    <div className="p-3 bg-red-50 rounded-lg">
                                        <p className="text-sm text-red-700">
                                            {selectedPayment.errorMessage}
                                        </p>
                                    </div>
                                )}

                                {selectedPayment.externalId && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">
                                            External Reference
                                        </p>
                                        <p className="font-mono text-sm">
                                            {selectedPayment.externalId}
                                        </p>
                                        {selectedPayment.externalStatus && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Status: {selectedPayment.externalStatus}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
