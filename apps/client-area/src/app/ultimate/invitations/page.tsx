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

interface Invitation {
    id: string;
    email: string;
    name: string;
    role: "admin" | "client";
    status: "pending" | "accepted" | "expired";
    sentAt: Date;
    expiresAt: Date;
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

export default function InvitationsPage() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteForm, setInviteForm] = useState({
        email: "",
        name: "",
        role: "client" as "admin" | "client",
    });
    const [isInviting, setIsInviting] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setInvitations([
                {
                    id: "1",
                    email: "new.client@example.com",
                    name: "New Client",
                    role: "client",
                    status: "pending",
                    sentAt: new Date(Date.now() - 86400000),
                    expiresAt: new Date(Date.now() + 6 * 86400000),
                },
                {
                    id: "2",
                    email: "partner@business.com",
                    name: "Business Partner",
                    role: "client",
                    status: "accepted",
                    sentAt: new Date(Date.now() - 3 * 86400000),
                    expiresAt: new Date(Date.now() + 4 * 86400000),
                },
                {
                    id: "3",
                    email: "new.admin@cvt.co.zw",
                    name: "New Admin",
                    role: "admin",
                    status: "pending",
                    sentAt: new Date(Date.now() - 2 * 86400000),
                    expiresAt: new Date(Date.now() + 5 * 86400000),
                },
                {
                    id: "4",
                    email: "expired@example.com",
                    name: "Expired Invite",
                    role: "client",
                    status: "expired",
                    sentAt: new Date(Date.now() - 10 * 86400000),
                    expiresAt: new Date(Date.now() - 3 * 86400000),
                },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleSendInvitation = async () => {
        setIsInviting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const now = new Date();
        setInvitations((prev) => [
            {
                id: String(prev.length + 1),
                email: inviteForm.email,
                name: inviteForm.name,
                role: inviteForm.role,
                status: "pending",
                sentAt: now,
                expiresAt: new Date(now.getTime() + 7 * 86400000),
            },
            ...prev,
        ]);
        setInviteForm({ email: "", name: "", role: "client" });
        setInviteDialogOpen(false);
        setIsInviting(false);
    };

    const handleResendInvitation = async (id: string) => {
        setInvitations((prev) =>
            prev.map((inv) =>
                inv.id === id
                    ? {
                        ...inv,
                        status: "pending" as const,
                        sentAt: new Date(),
                        expiresAt: new Date(Date.now() + 7 * 86400000),
                    }
                    : inv
            )
        );
    };

    const handleCancelInvitation = async (id: string) => {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
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
                    <h1 className="text-3xl font-bold text-gray-900">Invitations</h1>
                    <p className="text-gray-500 text-md mt-1">
                        Christus Veritas Technologies - Send and manage user invitations
                    </p>
                </div>
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-premium-purple hover:bg-premium-purple/90">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Send Invitation
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Send Invitation</DialogTitle>
                            <DialogDescription>
                                Invite a new user to join the platform. They will receive an email with a link to create their account.
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
                                        <SelectItem value="admin">Admin (CVT Staff)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">
                                    {inviteForm.role === "admin"
                                        ? "Admins can access the Ultimate dashboard and manage all users/services."
                                        : "Clients can access the client portal to view their services and billing."}
                                </p>
                            </div>
                            <Button
                                className="w-full bg-premium-purple hover:bg-premium-purple/90"
                                onClick={handleSendInvitation}
                                disabled={isInviting || !inviteForm.email || !inviteForm.name}
                            >
                                {isInviting ? "Sending..." : "Send Invitation"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Sent</p>
                                <p className="text-2xl font-bold">{invitations.length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {invitations.filter((i) => i.status === "pending").length}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Accepted</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {invitations.filter((i) => i.status === "accepted").length}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Expired</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {invitations.filter((i) => i.status === "expired").length}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Invitations Table */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Invitations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Recipient</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Sent</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invitations.map((invitation) => (
                                    <TableRow key={invitation.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-gray-900">{invitation.name}</p>
                                                <p className="text-sm text-gray-500">{invitation.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invitation.role === "admin"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}>
                                                {invitation.role === "admin" ? "Admin" : "Client"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invitation.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : invitation.status === "accepted"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}>
                                                {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-gray-500">
                                            {new Date(invitation.sentAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-gray-500">
                                            {new Date(invitation.expiresAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {invitation.status === "pending" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleResendInvitation(invitation.id)}
                                                    >
                                                        Resend
                                                    </Button>
                                                )}
                                                {invitation.status === "expired" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleResendInvitation(invitation.id)}
                                                    >
                                                        Resend
                                                    </Button>
                                                )}
                                                {invitation.status !== "accepted" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700"
                                                        onClick={() => handleCancelInvitation(invitation.id)}
                                                    >
                                                        Cancel
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
        </motion.div>
    );
}
