"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/page-container";
import { Plus } from "@phosphor-icons/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = `${API_BASE}/api`;

interface ServiceDefinition {
    id: string;
    name: string;
    description: string | null;
    oneOffPrice: number | null;
    recurringPrice: number | null;
    recurringPricePerUnit: boolean;
    billingCycleDays: number;
    isActive: boolean;
    createdAt: string;
    _count?: {
        clientServices: number;
    };
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

export default function ServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState<ServiceDefinition[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];
    };

    const fetchServices = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/services/definitions?includeInactive=true`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Failed to fetch services:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);



    const handleToggleActive = async (serviceId: string, currentActive: boolean) => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/services/definitions/${serviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    isActive: !currentActive,
                }),
            });

            if (response.ok) {
                await fetchServices();
            }
        } catch (error) {
            console.error("Failed to toggle service status:", error);
        }
    };

    const getBillingCycleLabel = (days: number) => {
        if (days === 1) return "Daily";
        if (days === 7) return "Weekly";
        if (days === 14) return "Bi-weekly";
        if (days === 30) return "Monthly";
        if (days === 90) return "Quarterly";
        if (days === 365) return "Yearly";
        return `Every ${days} days`;
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

    const activeServices = services.filter((s) => s.isActive);
    const totalSubscribers = services.reduce((acc, s) => acc + (s._count?.clientServices || 0), 0);

    return (
        <PageContainer>
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Services</h1>
                    <p className="text-muted-foreground mt-1">
                        Define and manage your service offerings
                    </p>
                </div>
                <Button onClick={() => router.push("/ultimate/services/new")} className="gap-2">
                    <Plus className="w-4 h-4" weight="bold" />
                    Create Service
                </Button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Services
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{services.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Services
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{activeServices.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Clients Subscribed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSubscribers}</div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Services Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Card className={!service.isActive ? "opacity-60" : ""}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{service.name}</CardTitle>
                                    <Badge variant={service.isActive ? "default" : "secondary"}>
                                        {service.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                {service.description && (
                                    <CardDescription className="line-clamp-2">
                                        {service.description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    {service.oneOffPrice !== null && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">One-time</span>
                                            <span className="font-medium">${service.oneOffPrice}</span>
                                        </div>
                                    )}
                                    {service.recurringPrice !== null && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Recurring</span>
                                            <span className="font-medium">
                                                ${service.recurringPrice}
                                                {service.recurringPricePerUnit ? "/unit" : ""} / {getBillingCycleLabel(service.billingCycleDays)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Clients</span>
                                        <span className="font-medium">{service._count?.clientServices || 0}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleToggleActive(service.id, service.isActive)}
                                    >
                                        {service.isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {services.length === 0 && (
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
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium">No services yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create your first service to start provisioning to clients
                    </p>
                    <Button className="mt-4" onClick={() => router.push("/ultimate/services/new")}>
                        Create Service
                    </Button>
                </motion.div>
            )}
        </PageContainer>
    );
}
