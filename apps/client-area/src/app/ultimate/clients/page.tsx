"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    Users,
    UserPlus,
    Package,
    TrendUp,
    MagnifyingGlass,
    Eye,
    EnvelopeSimple,
    Calendar,
} from "@phosphor-icons/react";
import { PageContainer } from "@/components/page-container";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = `${API_BASE}/api`;

interface ClientService {
    id: string;
    status: string;
    units: number;
    serviceDefinition: {
        id: string;
        name: string;
    };
}

interface Client {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    clientServices: ClientService[];
}

interface ClientStats {
    totalClients: number;
    activeServices: number;
    clientsWithActiveServices: number;
    recentClients: number;
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

export default function ClientsPage() {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [stats, setStats] = useState<ClientStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];
    };

    const fetchClients = async (search?: string) => {
        try {
            const authToken = getAuthToken();
            const url = search
                ? `${API_URL}/clients?search=${encodeURIComponent(search)}`
                : `${API_URL}/clients`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setClients(data);
            }
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        }
    };

    const fetchStats = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/clients/stats`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchClients(), fetchStats()]);
            setIsLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchClients(searchQuery);
        }, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

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

    return (
        <PageContainer>
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-500 mt-1">
                        Manage your client relationships and services
                    </p>
                </div>
                <Button onClick={() => router.push("/ultimate/invitations")} className="gap-2">
                    <UserPlus weight="bold" className="w-4 h-4" />
                    Invite Client
                </Button>
            </motion.div>

            {/* Stats Cards */}
            {stats && (
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Clients</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalClients}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Users weight="duotone" className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Active Services</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeServices}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                    <Package weight="duotone" className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">With Services</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.clientsWithActiveServices}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Users weight="duotone" className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">New (30 days)</p>
                                    <p className="text-3xl font-bold text-green-600 mt-1">+{stats.recentClients}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <TrendUp weight="duotone" className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Search and Filters */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search clients by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white"
                    />
                </div>
            </motion.div>

            {/* Clients Table */}
            <motion.div variants={itemVariants}>
                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                    <TableHead className="font-semibold text-gray-700">Client</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Services</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Joined</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.length > 0 ? (
                                    clients.map((client) => (
                                        <TableRow
                                            key={client.id}
                                            className="hover:bg-gray-50/50 cursor-pointer"
                                            onClick={() => router.push(`/ultimate/clients/${client.id}`)}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-primary font-semibold">
                                                            {(client.name || client.email)[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {client.name || "Unnamed Client"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{client.email}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {client.clientServices.slice(0, 2).map((service) => (
                                                        <Badge
                                                            key={service.id}
                                                            variant={service.status === "ACTIVE" ? "default" : "secondary"}
                                                            className="text-xs"
                                                        >
                                                            {service.serviceDefinition.name}
                                                        </Badge>
                                                    ))}
                                                    {client.clientServices.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{client.clientServices.length - 2}
                                                        </Badge>
                                                    )}
                                                    {client.clientServices.length === 0 && (
                                                        <span className="text-sm text-gray-400">No services</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar weight="regular" className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        {new Date(client.createdAt).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/ultimate/clients/${client.id}`);
                                                    }}
                                                    className="gap-2"
                                                >
                                                    <Eye weight="regular" className="w-4 h-4" />
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                                    <Users weight="duotone" className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900">No clients found</h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {searchQuery ? "Try a different search term" : "Get started by inviting your first client"}
                                                </p>
                                                {!searchQuery && (
                                                    <Button className="mt-4 gap-2" onClick={() => router.push("/ultimate/invitations")}>
                                                        <EnvelopeSimple weight="bold" className="w-4 h-4" />
                                                        Invite a Client
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
        </PageContainer>
    );
}
