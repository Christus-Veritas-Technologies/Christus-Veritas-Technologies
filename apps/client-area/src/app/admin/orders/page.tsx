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
    DialogFooter,
} from "@/components/ui/dialog";
import {
    ShoppingCart,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    CaretLeft,
    CaretRight,
    Package,
    User,
    Receipt,
    ArrowClockwise,
} from "@phosphor-icons/react";
import { apiClientWithAuth } from "@/lib/api-client";

interface Order {
    id: string;
    itemType: string;
    itemId: string;
    quantity: number;
    amount: number;
    paymentId: string | null;
    reference: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string | null;
        email: string;
        businessName: string | null;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

const statusColors: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-purple-100 text-purple-700",
};

const statusIcons: Record<string, React.ReactNode> = {
    COMPLETED: <CheckCircle className="w-4 h-4" />,
    PENDING: <Clock className="w-4 h-4" />,
    FAILED: <XCircle className="w-4 h-4" />,
    REFUNDED: <ArrowClockwise className="w-4 h-4" />,
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrders = async (page = 1) => {
        try {
            setIsLoading(true);

            const params = new URLSearchParams({ page: page.toString(), limit: "20" });
            if (statusFilter !== "all") params.append("status", statusFilter);

            const response = await apiClientWithAuth<{ orders: Order[]; pagination: Pagination }>(
                `/admin/orders?${params}`
            );

            if (response.ok && response.data) {
                setOrders(response.data.orders);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const openOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        setIsUpdating(true);
        try {
            const response = await apiClientWithAuth(`/admin/orders/${orderId}/status`, {
                method: "PATCH",
                body: { status },
            });

            if (response.ok) {
                setIsDialogOpen(false);
                fetchOrders(pagination?.page || 1);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
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

    // Calculate stats from current orders
    const stats = {
        total: pagination?.total || 0,
        pending: orders.filter((o) => o.status === "PENDING").length,
        completed: orders.filter((o) => o.status === "COMPLETED").length,
        totalValue: orders.reduce((sum, o) => sum + o.amount, 0) / 100,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">
                        Track and manage all customer orders
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ShoppingCart className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{stats.completed}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Receipt className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Value</p>
                                <p className="text-2xl font-bold">
                                    ${stats.totalValue.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Orders</CardTitle>
                            <CardDescription>
                                View and manage customer orders
                            </CardDescription>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                                <SelectItem value="REFUNDED">Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reference</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
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
                                        {[...Array(8)].map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground">No orders found</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <span className="font-mono text-sm font-medium">
                                                {order.reference}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm">
                                                    {order.user.name || order.user.email}
                                                </p>
                                                {order.user.businessName && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {order.user.businessName}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">{order.itemType}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{order.quantity}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">
                                                ${(order.amount / 100).toFixed(2)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[order.status]}>
                                                <span className="flex items-center gap-1">
                                                    {statusIcons[order.status]}
                                                    {order.status}
                                                </span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openOrderDetails(order)}
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
                                    onClick={() => fetchOrders(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                >
                                    <CaretLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchOrders(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.pages}
                                >
                                    <CaretRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogDescription>
                                    Reference: {selectedOrder.reference}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge className={statusColors[selectedOrder.status]}>
                                        <span className="flex items-center gap-1">
                                            {statusIcons[selectedOrder.status]}
                                            {selectedOrder.status}
                                        </span>
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-bold text-lg">
                                        ${(selectedOrder.amount / 100).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Item Type</span>
                                    <span>{selectedOrder.itemType}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Quantity</span>
                                    <span>{selectedOrder.quantity}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Customer</span>
                                    <div className="text-right">
                                        <p>{selectedOrder.user.name || selectedOrder.user.email}</p>
                                        {selectedOrder.user.businessName && (
                                            <p className="text-sm text-muted-foreground">
                                                {selectedOrder.user.businessName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Created</span>
                                    <span>{formatDate(selectedOrder.createdAt)}</span>
                                </div>

                                {selectedOrder.paymentId && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Payment ID</span>
                                        <span className="font-mono text-sm">
                                            {selectedOrder.paymentId}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="mt-6">
                                {selectedOrder.status === "PENDING" && (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="text-red-600"
                                            onClick={() =>
                                                updateOrderStatus(selectedOrder.id, "FAILED")
                                            }
                                            disabled={isUpdating}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Mark Failed
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                updateOrderStatus(selectedOrder.id, "COMPLETED")
                                            }
                                            disabled={isUpdating}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Mark Completed
                                        </Button>
                                    </>
                                )}
                                {selectedOrder.status === "COMPLETED" && (
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            updateOrderStatus(selectedOrder.id, "REFUNDED")
                                        }
                                        disabled={isUpdating}
                                    >
                                        <ArrowClockwise className="w-4 h-4 mr-2" />
                                        Refund Order
                                    </Button>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
