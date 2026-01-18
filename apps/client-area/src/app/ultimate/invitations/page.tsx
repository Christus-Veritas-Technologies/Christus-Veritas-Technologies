"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/page-container";
import { PaperPlaneTilt } from "@phosphor-icons/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = `${API_BASE}/api`;

interface Invitation {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CLIENT";
    status: "PENDING" | "ACCEPTED" | "CANCELLED" | "EXPIRED";
    createdAt: string;
    expiresAt: string;
    provisionServiceId: string | null;
    provisionUnits: number | null;
    provisionRecurring: boolean | null;
    provisionService?: {
        id: string;
        name: string;
    } | null;
}

interface ServiceDefinition {
    id: string;
    name: string;
    description: string | null;
    oneOffPrice: number | null;
    recurringPrice: number | null;
    recurringPricePerUnit: boolean;
    billingCycleDays: number;
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
    const router = useRouter();
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [serviceDefinitions, setServiceDefinitions] = useState<ServiceDefinition[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];
    };

    const fetchInvitations = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/invitations`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setInvitations(data);
            }
        } catch (error) {
            console.error("Failed to fetch invitations:", error);
        }
    };

    const fetchServiceDefinitions = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/services/definitions`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setServiceDefinitions(data);
            }
        } catch (error) {
            console.error("Failed to fetch service definitions:", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchInvitations(), fetchServiceDefinitions()]);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleResendInvitation = async (id: string) => {
        try {
            const authToken = getAuthToken();
            await fetch(`${API_URL}/invitations/${id}/resend`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            await fetchInvitations();
        } catch (error) {
            console.error("Failed to resend invitation:", error);
        }
    };

    const handleCancelInvitation = async (id: string) => {
        try {
            const authToken = getAuthToken();
            await fetch(`${API_URL}/invitations/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            await fetchInvitations();
        } catch (error) {
            console.error("Failed to cancel invitation:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    const pendingCount = invitations.filter((i) => i.status === "PENDING").length;
    const acceptedCount = invitations.filter((i) => i.status === "ACCEPTED").length;
    const expiredCount = invitations.filter((i) => i.status === "EXPIRED" || i.status === "CANCELLED").length;

    return (
        <PageContainer>
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Invitations</h1>
                    <p className="text-muted-foreground mt-1">
                        Send and manage user invitations
                    </p>
                </div>
                <Button onClick={() => router.push("/ultimate/invitations/new")} className="gap-2">
                    <PaperPlaneTilt className="w-4 h-4" weight="bold" />
                    Send Invitation
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Sent</p>
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
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
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
                                <p className="text-sm text-muted-foreground">Accepted</p>
                                <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
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
                                <p className="text-sm text-muted-foreground">Expired/Cancelled</p>
                                <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
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
                        {invitations.length === 0 ? (
                            <div className="text-center py-8">
                                <svg
                                    className="mx-auto h-12 w-12 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium">No invitations yet</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Send your first invitation to get started
                                </p>
                                <Button className="mt-4" onClick={() => router.push("/ultimate/invitations/new")}>
                                    Send Invitation
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Recipient</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Service</TableHead>
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
                                                    <p className="font-medium">{invitation.name}</p>
                                                    <p className="text-sm text-muted-foreground">{invitation.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={invitation.role === "ADMIN" ? "default" : "secondary"}>
                                                    {invitation.role === "ADMIN" ? "Admin" : "Client"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {invitation.provisionService ? (
                                                    <Badge variant="outline">
                                                        {invitation.provisionService.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        invitation.status === "PENDING"
                                                            ? "secondary"
                                                            : invitation.status === "ACCEPTED"
                                                                ? "default"
                                                                : "destructive"
                                                    }
                                                >
                                                    {invitation.status.charAt(0) + invitation.status.slice(1).toLowerCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(invitation.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(invitation.expiresAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {(invitation.status === "PENDING" || invitation.status === "EXPIRED") && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleResendInvitation(invitation.id)}
                                                        >
                                                            Resend
                                                        </Button>
                                                    )}
                                                    {invitation.status !== "ACCEPTED" && (
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
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </PageContainer>
    );
}
