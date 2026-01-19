"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Wrench,
    ArrowLeft,
    ShoppingCart,
} from "@phosphor-icons/react";
import { apiClientWithAuth } from "@/lib/api-client";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

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
    updatedAt: string;
}

function formatPrice(cents: number, currency: string = "USD") {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(cents / 100);
}

function ServiceCard({ service }: {
    service: ServiceDefinition;
}) {
    const hasRecurring = service.recurringPrice && service.recurringPrice > 0;
    const hasOneOff = service.oneOffPrice && service.oneOffPrice > 0;

    const billingCycleText = service.billingCycleDays === 30 ? "month"
        : service.billingCycleDays === 7 ? "week"
            : service.billingCycleDays === 365 ? "year"
                : `${service.billingCycleDays} days`;

    return (
        <motion.div variants={itemVariants}>
            <Link href={`/dashboard/marketplace/services/${service.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden h-full cursor-pointer">
                    <div className="aspect-video bg-secondary/5 relative overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                            <Wrench
                                weight="duotone"
                                className="w-12 h-12 text-secondary/30"
                            />
                        </div>
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                        {service.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {service.description}
                            </p>
                        )}
                        <div className="flex items-center justify-between">
                            <div>
                                {hasRecurring && (
                                    <span className="text-lg font-bold text-secondary">
                                        {formatPrice(service.recurringPrice!, "USD")}
                                        {service.recurringPricePerUnit && <span className="text-xs">/unit</span>}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            /{billingCycleText}
                                        </span>
                                    </span>
                                )}
                                {hasOneOff && !hasRecurring && (
                                    <span className="text-lg font-bold text-secondary">
                                        {formatPrice(service.oneOffPrice!, "USD")}
                                    </span>
                                )}
                                {hasOneOff && hasRecurring && (
                                    <p className="text-xs text-muted-foreground">
                                        + {formatPrice(service.oneOffPrice!, "USD")} setup
                                    </p>
                                )}
                            </div>
                            <Button
                                size="sm"
                                className="gap-1 bg-secondary hover:bg-secondary/90"
                            >
                                <ShoppingCart className="w-3 h-3" />
                                View
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                    <Skeleton className="aspect-video" />
                    <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex justify-between pt-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function AllServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState<ServiceDefinition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true);
            try {
                const response = await apiClientWithAuth<ServiceDefinition[]>(
                    `/services/definitions`
                );
                if (!response.ok || !response.data) throw new Error("Failed to fetch services");
                // Filter to only active services
                const activeServices = response.data.filter(s => s.isActive);
                setServices(activeServices);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <Link href="/dashboard/marketplace">
                    <Button variant="ghost" size="sm" className="gap-1 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Marketplace
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Wrench weight="duotone" className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Services</h1>
                        <p className="text-muted-foreground">
                            {services.length || 0} services available
                        </p>
                    </div>
                </div>
            </motion.div>

            {isLoading && <LoadingSkeleton />}

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !error && services.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                        <Wrench
                            weight="duotone"
                            className="w-16 h-16 text-gray-300 mx-auto mb-4"
                        />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Services Available
                        </h3>
                        <p className="text-muted-foreground">
                            Check back later for new services.
                        </p>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !error && services.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                        />
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}
