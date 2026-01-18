"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Users,
    ShieldCheck,
    User as UserIcon,
    CaretLeft,
    CaretRight,
    MagnifyingGlass,
    CaretUp,
    CaretDown,
    UserPlus,
    Spinner,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { PageContainer } from "@/components/page-container";

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

interface User {
    id: string;
    email: string;
    name: string | null;
    isAdmin: boolean;
    createdAt: string;
    emailVerified: string | null;
    _count?: {
        projects: number;
        orders: number;
    };
}

interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterRole, setFilterRole] = useState<"all" | "admin" | "client">("all");
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteForm, setInviteForm] = useState({
        email: "",
        name: "",
        role: "client" as "admin" | "client",
    });
    const [isInviting, setIsInviting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [totalClients, setTotalClients] = useState(0);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to first page on search
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                sortBy,
                sortOrder,
            });
            if (debouncedSearch) params.append("search", debouncedSearch);

            const response = await fetch(`${API_BASE}/api/admin/users?${params}`, {
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to fetch users");

            const data: UsersResponse = await response.json();
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setTotalUsers(data.total);

            // Calculate admin/client counts from fetched data
            const admins = data.users.filter(u => u.isAdmin).length;
            setTotalAdmins(admins);
            setTotalClients(data.users.length - admins);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [page, debouncedSearch, sortBy, sortOrder]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Filter users by role (client-side filtering for current page)
    const filteredUsers = users.filter((user) => {
        if (filterRole === "all") return true;
        if (filterRole === "admin") return user.isAdmin;
        return !user.isAdmin;
    });

    const handleInvite = async () => {
        setIsInviting(true);
        try {
            const response = await fetch(`${API_BASE}/api/invitation/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: inviteForm.email,
                    name: inviteForm.name,
                    isAdmin: inviteForm.role === "admin",
                }),
            });

            if (!response.ok) throw new Error("Failed to send invitation");

            toast.success(`Invitation sent to ${inviteForm.email}`);

            setInviteForm({ email: "", name: "", role: "client" });
            setInviteDialogOpen(false);
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error("Error sending invitation:", error);
            toast.error("Failed to send invitation. Please try again.");
        } finally {
            setIsInviting(false);
        }
    };

    const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
        setUpdatingUserId(userId);
        try {
            const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ isAdmin: !currentIsAdmin }),
            });

            if (!response.ok) throw new Error("Failed to update user");

            toast.success(`User role changed to ${!currentIsAdmin ? "Admin" : "Client"}`);

            // Update local state
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, isAdmin: !currentIsAdmin } : user
                )
            );
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user. Please try again.");
        } finally {
            setUpdatingUserId(null);
        }
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (sortBy !== field) return null;
        return sortOrder === "asc" ? (
            <CaretUp className="w-4 h-4 inline ml-1" />
        ) : (
            <CaretDown className="w-4 h-4 inline ml-1" />
        );
    };

    if (isLoading && users.length === 0) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-64 bg-gray-200 rounded" />
                    <div className="grid grid-cols-3 gap-4">
                        <div className="h-24 bg-gray-200 rounded-lg" />
                        <div className="h-24 bg-gray-200 rounded-lg" />
                        <div className="h-24 bg-gray-200 rounded-lg" />
                    </div>
                    <div className="h-96 bg-gray-200 rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <PageContainer>
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-500 text-md mt-1">
                        Manage all users and permissions
                    </p>
                </div>
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <UserPlus className="w-4 h-4 mr-2" weight="bold" />
                            Invite User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite New User</DialogTitle>
                            <DialogDescription>
                                Send an invitation to add a new user to the platform.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="invite-name">Name</Label>
                                <Input
                                    id="invite-name"
                                    placeholder="John Doe"
                                    value={inviteForm.name}
                                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="invite-email">Email</Label>
                                <Input
                                    id="invite-email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={inviteForm.email}
                                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="invite-role">Role</Label>
                                <Select
                                    value={inviteForm.role}
                                    onValueChange={(value: "admin" | "client") => setInviteForm({ ...inviteForm, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="client">Client</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                className="w-full bg-primary hover:bg-primary/90"
                                onClick={handleInvite}
                                disabled={isInviting || !inviteForm.email}
                            >
                                {isInviting ? (
                                    <>
                                        <Spinner className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Invitation"
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants} className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-xs">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={filterRole} onValueChange={(value: "all" | "admin" | "client") => setFilterRole(value)}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="admin">Admins Only</SelectItem>
                        <SelectItem value="client">Clients Only</SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Users</p>
                                <p className="text-2xl font-bold">{totalUsers}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" weight="duotone" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Admins</p>
                                <p className="text-2xl font-bold">{totalAdmins}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-secondary" weight="duotone" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Clients</p>
                                <p className="text-2xl font-bold">{totalClients}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-green-600" weight="duotone" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Users Table */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">All Users</CardTitle>
                        {isLoading && (
                            <Spinner className="w-5 h-5 animate-spin text-gray-400" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer hover:text-gray-900"
                                        onClick={() => handleSort("name")}
                                    >
                                        User <SortIcon field="name" />
                                    </TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:text-gray-900"
                                        onClick={() => handleSort("createdAt")}
                                    >
                                        Joined <SortIcon field="createdAt" />
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                                        <span className="text-gray-700 font-medium">
                                                            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.name || "Unnamed"}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isAdmin
                                                        ? "bg-secondary/10 text-secondary"
                                                        : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {user.isAdmin ? "Admin" : "Client"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.emailVerified
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}>
                                                    {user.emailVerified ? "Verified" : "Pending"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                                                    disabled={updatingUserId === user.id}
                                                >
                                                    {updatingUserId === user.id ? (
                                                        <Spinner className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        user.isAdmin ? "Make Client" : "Make Admin"
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <p className="text-sm text-gray-500">
                                    Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, totalUsers)} of {totalUsers} users
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        <CaretLeft className="w-4 h-4" />
                                        Previous
                                    </Button>
                                    <span className="text-sm text-gray-600 px-2">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        Next
                                        <CaretRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </PageContainer>
    );
}
