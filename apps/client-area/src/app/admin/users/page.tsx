"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
    Users,
    MagnifyingGlass,
    Eye,
    ShieldCheck,
    CaretLeft,
    CaretRight,
    EnvelopeSimple,
    Phone,
    Buildings,
    Calendar,
    Package,
    Briefcase,
    ShoppingCart,
} from "@phosphor-icons/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface User {
    id: string;
    email: string;
    name: string | null;
    phoneNumber: string | null;
    businessName: string | null;
    businessAddress: string | null;
    isAdmin: boolean;
    emailVerified: string | null;
    onboardingCompleted: boolean;
    image: string | null;
    createdAt: string;
    _count: {
        clientServices: number;
        orders: number;
        projects: number;
    };
}

interface UserDetails extends User {
    clientServices: any[];
    orders: any[];
    projects: any[];
    savedPaymentMethods: any[];
    notifications: any[];
    recentPayments: any[];
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const getToken = () => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];
    };

    const fetchUsers = async (page = 1, searchQuery = "") => {
        try {
            setIsLoading(true);
            const token = getToken();
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "20",
            });
            if (searchQuery) params.append("search", searchQuery);

            const res = await fetch(`${API_URL}/admin/users?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch users");

            const data = await res.json();
            setUsers(data.users);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserDetails = async (userId: string) => {
        try {
            setIsLoadingDetails(true);
            const token = getToken();
            const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch user details");

            const data = await res.json();
            setSelectedUser(data);
            setIsDialogOpen(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const toggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
        try {
            const token = getToken();
            const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isAdmin: !currentIsAdmin }),
            });

            if (!res.ok) throw new Error("Failed to update user");

            // Refresh the list
            fetchUsers(pagination?.page || 1, search);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(1, search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Users</h1>
                    <p className="text-muted-foreground">
                        Manage all users on the platform
                    </p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                    <Users className="w-4 h-4 mr-2" />
                    {pagination?.total || 0} total
                </Badge>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or business..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Business</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Activity</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Skeleton className="h-10 w-48" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-32" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-6 w-20" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-20" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-8 w-16 ml-auto" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground">No users found</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    {user.image ? (
                                                        <img
                                                            src={user.image}
                                                            alt={user.name || "User"}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <Users className="w-5 h-5 text-gray-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {user.name || "No name"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {user.businessName || (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {user.isAdmin && (
                                                    <Badge className="bg-purple-100 text-purple-700">
                                                        Admin
                                                    </Badge>
                                                )}
                                                {user.emailVerified ? (
                                                    <Badge className="bg-green-100 text-green-700">
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">Unverified</Badge>
                                                )}
                                                {!user.onboardingCompleted && (
                                                    <Badge variant="outline" className="text-amber-600">
                                                        Onboarding
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span title="Services">
                                                    <Package className="w-4 h-4 inline" />{" "}
                                                    {user._count.clientServices}
                                                </span>
                                                <span title="Orders">
                                                    <ShoppingCart className="w-4 h-4 inline" />{" "}
                                                    {user._count.orders}
                                                </span>
                                                <span title="Projects">
                                                    <Briefcase className="w-4 h-4 inline" />{" "}
                                                    {user._count.projects}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => fetchUserDetails(user.id)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleAdmin(user.id, user.isAdmin)}
                                                    title={user.isAdmin ? "Remove admin" : "Make admin"}
                                                >
                                                    <ShieldCheck
                                                        className={`w-4 h-4 ${user.isAdmin ? "text-purple-600" : ""}`}
                                                    />
                                                </Button>
                                            </div>
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
                                    onClick={() => fetchUsers(pagination.page - 1, search)}
                                    disabled={pagination.page <= 1}
                                >
                                    <CaretLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchUsers(pagination.page + 1, search)}
                                    disabled={pagination.page >= pagination.pages}
                                >
                                    <CaretRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    {isLoadingDetails ? (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : selectedUser ? (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        {selectedUser.image ? (
                                            <img
                                                src={selectedUser.image}
                                                alt={selectedUser.name || "User"}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <Users className="w-6 h-6 text-gray-500" />
                                        )}
                                    </div>
                                    <div>
                                        <p>{selectedUser.name || "No name"}</p>
                                        <p className="text-sm font-normal text-muted-foreground">
                                            {selectedUser.email}
                                        </p>
                                    </div>
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6 mt-4">
                                {/* Contact Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <EnvelopeSimple className="w-4 h-4 text-muted-foreground" />
                                        <span>{selectedUser.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span>{selectedUser.phoneNumber || "Not provided"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Buildings className="w-4 h-4 text-muted-foreground" />
                                        <span>{selectedUser.businessName || "Not provided"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span>Joined {formatDate(selectedUser.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Status Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {selectedUser.isAdmin && (
                                        <Badge className="bg-purple-100 text-purple-700">Admin</Badge>
                                    )}
                                    {selectedUser.emailVerified ? (
                                        <Badge className="bg-green-100 text-green-700">
                                            Email Verified
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Email Unverified</Badge>
                                    )}
                                    {selectedUser.onboardingCompleted ? (
                                        <Badge className="bg-blue-100 text-blue-700">
                                            Onboarding Complete
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-amber-600">
                                            Onboarding Incomplete
                                        </Badge>
                                    )}
                                </div>

                                {/* Services */}
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Services ({selectedUser.clientServices.length})
                                    </h4>
                                    {selectedUser.clientServices.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No services</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedUser.clientServices.map((service: any) => (
                                                <div
                                                    key={service.id}
                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                                                >
                                                    <span>{service.serviceDefinition.name}</span>
                                                    <Badge
                                                        variant={
                                                            service.status === "ACTIVE"
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {service.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Recent Orders */}
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4" />
                                        Recent Orders ({selectedUser.orders.length})
                                    </h4>
                                    {selectedUser.orders.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No orders</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedUser.orders.slice(0, 5).map((order: any) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                                                >
                                                    <div>
                                                        <span className="font-medium">{order.reference}</span>
                                                        <span className="text-muted-foreground ml-2">
                                                            ${(order.amount / 100).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            order.status === "COMPLETED"
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Recent Projects */}
                                <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        Recent Projects ({selectedUser.projects.length})
                                    </h4>
                                    {selectedUser.projects.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No projects</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedUser.projects.slice(0, 5).map((project: any) => (
                                                <div
                                                    key={project.id}
                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                                                >
                                                    <span>{project.title}</span>
                                                    <Badge variant="outline">{project.status}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    );
}
