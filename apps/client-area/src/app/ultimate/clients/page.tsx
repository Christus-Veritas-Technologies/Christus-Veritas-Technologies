"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

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

    const getActiveServicesCount = (client: Client) => {
        return client.clientServices.filter((s) => s.status === "ACTIVE").length;
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

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Clients</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your client relationships and services
                    </p>
                </div>
                <Button onClick={() => router.push("/ultimate/invitations")}>
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Invite Client
                </Button>
            </motion.div>

            {/* Stats Cards */}
            {stats && (
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Clients
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalClients}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Active Services
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeServices}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Clients with Services
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.clientsWithActiveServices}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                New (30 days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">+{stats.recentClients}</div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Search */}
            <motion.div variants={itemVariants}>
                <Input
                    placeholder="Search clients by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                />
            </motion.div>

            {/* Clients Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => (
                    <motion.div
                        key={client.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => router.push(`/ultimate/clients/${client.id}`)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        {client.name || "Unnamed Client"}
                                    </CardTitle>
                                    {getActiveServicesCount(client) > 0 && (
                                        <Badge variant="default">
                                            {getActiveServicesCount(client)} active
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {client.clientServices.slice(0, 3).map((service) => (
                                        <Badge
                                            key={service.id}
                                            variant={service.status === "ACTIVE" ? "secondary" : "outline"}
                                            className="text-xs"
                                        >
                                            {service.serviceDefinition.name}
                                        </Badge>
                                    ))}
                                    {client.clientServices.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{client.clientServices.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Joined {new Date(client.createdAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {clients.length === 0 && (
                <motion.div variants={itemVariants} className="text-center py-12">
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium">No clients found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {searchQuery ? "Try a different search term" : "Get started by inviting your first client"}
                    </p>
                    {!searchQuery && (
                        <Button className="mt-4" onClick={() => router.push("/ultimate/invitations")}>
                            Invite a Client
                        </Button>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}
