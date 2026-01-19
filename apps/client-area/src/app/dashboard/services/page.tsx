"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Desktop,
    CheckCircle,
    Warning,
    XCircle,
    Info,
    ArrowRight,
    Package,
} from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useServices } from "@/lib/api";

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

function ServicesLoadingSkeleton() {
    return (
        <div className="p-6 space-y-6">
            {/* Header skeleton */}
            <div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Stats cards skeleton */}
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-7 w-12" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Services list skeleton */}
            <div className="grid gap-4">
                {[1, 2].map((i) => (
                    <Card key={i}>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="w-14 h-14 rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-40" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((j) => (
                                    <div key={j} className="p-4 bg-gray-50 rounded-lg space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

const getServiceStatusBadge = (status: string) => {
    switch (status) {
        case "ACTIVE":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Active
                </Badge>
            );
        case "SUSPENDED":
            return (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
                    <Warning weight="fill" className="w-3 h-3" />
                    Suspended
                </Badge>
            );
        case "CANCELLED":
        case "INACTIVE":
            return (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
                    <XCircle weight="fill" className="w-3 h-3" />
                    Cancelled
                </Badge>
            );
        case "PENDING":
            return (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1">
                    <Warning weight="fill" className="w-3 h-3" />
                    Pending
                </Badge>
            );
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function ServicesPage() {
    const { data: services, isLoading, error } = useServices();

    const activeServices = services?.filter(s => s.status === "ACTIVE").length || 0;
    const totalServices = services?.length || 0;

    if (isLoading) {
        return <ServicesLoadingSkeleton />;
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                <p className="text-muted-foreground mt-1">
                    View your active services and subscriptions
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Desktop weight="duotone" className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Services</p>
                                <p className="text-2xl font-bold">{totalServices}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <CheckCircle weight="duotone" className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active</p>
                                <p className="text-2xl font-bold">{activeServices}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <Package weight="duotone" className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Categories</p>
                                <p className="text-2xl font-bold">
                                    {new Set(services?.filter(s => s.service).map(s => s.service?.category)).size || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Services List */}
            {error ? (
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex flex-col items-center justify-center text-red-600">
                                <Warning weight="duotone" className="w-8 h-8 mb-2" />
                                <p>Failed to load services</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : services && services.length > 0 ? (
                <motion.div variants={itemVariants} className="grid gap-4">
                    {services.filter(Boolean).map((service) => (
                        service ? (
                            <Card key={service.id} className="border-primary/20">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <Desktop weight="duotone" className="w-8 h-8 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">{service.name}</CardTitle>
                                                <CardDescription>
                                                    {service.service?.name || 'Service'} • {service.service?.category || 'Uncategorized'}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        {getServiceStatusBadge(service.status)}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground">Monthly Fee</p>
                                            <p className="text-xl font-bold">${(service.monthlyPrice / 100).toFixed(2)}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground">Billing Cycle</p>
                                            <p className="text-lg font-semibold capitalize">{service.billingCycle?.toLowerCase() || 'Monthly'}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground">Next Billing</p>
                                            <p className="text-lg font-semibold">
                                                {service.nextBillingDate
                                                    ? new Date(service.nextBillingDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground">Started</p>
                                            <p className="text-lg font-semibold">
                                                {new Date(service.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {service.description && (
                                        <p className="text-sm text-muted-foreground mt-4">{service.description}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ) : null
                    ))}
                </motion.div>
            ) : (
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardContent className="p-8">
                            <div className="text-center text-muted-foreground">
                                <Desktop weight="duotone" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No services yet</p>
                                <p className="text-sm">Contact us to get started with our services</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Support Info */}
            <motion.div variants={itemVariants}>
                <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <Info weight="duotone" className="w-8 h-8 text-blue-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    If you&apos;re experiencing issues with your services or need assistance,
                                    our support team is here to help.
                                </p>
                                <Button variant="outline" className="gap-2">
                                    Contact Support
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
