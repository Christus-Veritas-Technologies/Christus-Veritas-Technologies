"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface User {
    id: string;
    email: string;
    name: string | null;
    isAdmin: boolean;
    createdAt: Date;
    emailVerified: Date | null;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState<"all" | "admin" | "client">("all");
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteForm, setInviteForm] = useState({
        email: "",
        name: "",
        role: "client" as "admin" | "client",
    });
    const [isInviting, setIsInviting] = useState(false);

    useEffect(() => {
        // Mock data for now
        setTimeout(() => {
            setUsers([
                { id: "1", email: "admin@cvt.co.zw", name: "System Admin", isAdmin: true, createdAt: new Date("2024-01-01"), emailVerified: new Date("2024-01-01") },
                { id: "2", email: "john.doe@example.com", name: "John Doe", isAdmin: false, createdAt: new Date("2024-03-15"), emailVerified: new Date("2024-03-15") },
                { id: "3", email: "jane.smith@example.com", name: "Jane Smith", isAdmin: false, createdAt: new Date("2024-04-20"), emailVerified: null },
                { id: "4", email: "mike.johnson@example.com", name: "Mike Johnson", isAdmin: false, createdAt: new Date("2024-05-10"), emailVerified: new Date("2024-05-10") },
                { id: "5", email: "sarah.williams@cvt.co.zw", name: "Sarah Williams", isAdmin: true, createdAt: new Date("2024-02-01"), emailVerified: new Date("2024-02-01") },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole =
            filterRole === "all" ||
            (filterRole === "admin" && user.isAdmin) ||
            (filterRole === "client" && !user.isAdmin);
        return matchesSearch && matchesRole;
    });

    const handleInvite = async () => {
        setIsInviting(true);
        // TODO: Implement actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUsers((prev) => [
            ...prev,
            {
                id: String(prev.length + 1),
                email: inviteForm.email,
                name: inviteForm.name,
                isAdmin: inviteForm.role === "admin",
                createdAt: new Date(),
                emailVerified: null,
            },
        ]);
        setInviteForm({ email: "", name: "", role: "client" });
        setInviteDialogOpen(false);
        setIsInviting(false);
    };

    const handleToggleAdmin = async (userId: string) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
            )
        );
        // TODO: Implement actual API call
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-64 bg-gray-200 rounded" />
                    <div className="h-64 bg-gray-200 rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-500 text-md mt-1">
                        Christus Veritas Technologies - Manage all users and permissions
                    </p>
                </div>
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-premium-purple hover:bg-premium-purple/90">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
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
                                    placeholder="john doe"
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
                                className="w-full bg-premium-purple hover:bg-premium-purple/90"
                                onClick={handleInvite}
                                disabled={isInviting || !inviteForm.email}
                            >
                                {isInviting ? "Sending..." : "Send Invitation"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants} className="flex gap-4 mb-6">
                <Input
                    placeholder="search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs"
                />
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
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Admins</p>
                                <p className="text-2xl font-bold">{users.filter((u) => u.isAdmin).length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Clients</p>
                                <p className="text-2xl font-bold">{users.filter((u) => !u.isAdmin).length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Users Table */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <span className="text-gray-600 font-medium">
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
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.isAdmin
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}>
                                                {user.isAdmin ? "Admin" : "Client"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.emailVerified
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
                                                onClick={() => handleToggleAdmin(user.id)}
                                            >
                                                {user.isAdmin ? "Make Client" : "Make Admin"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
