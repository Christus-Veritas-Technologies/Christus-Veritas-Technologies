"use client";

import { useState, useEffect } from "react";
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
    ArrowRight,
    Star,
} from "@phosphor-icons/react";

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

interface MarketplaceService {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    oneOffPrice: number;
    recurringPrice: number;
    billingCycle: string;
    currency: string;
    category: string | null;
    isFeatured: boolean;
}

interface ServicesResponse {
    services: MarketplaceService[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

function formatPrice(cents: number, currency: string = "USD") {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(cents / 100);
}

function ServiceCard({ service }: { service: MarketplaceService }) {
    const hasRecurring = service.recurringPrice > 0;
    const hasOneOff = service.oneOffPrice > 0;

    return (
        <motion.div variants={itemVariants}>
            <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden h-full">
                <div className="aspect-video bg-secondary/5 relative overflow-hidden">
                    {service.imageUrl ? (
                        <img
                            src={service.imageUrl}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Wrench
                                weight="duotone"
                                className="w-12 h-12 text-secondary/30"
                            />
                        </div>
                    )}
                    {service.isFeatured && (
                        <Badge className="absolute top-2 right-2 bg-secondary hover:bg-secondary gap-1">
                            <Star weight="fill" className="w-3 h-3" />
                            Featured
                        </Badge>
                    )}
                    {service.category && (
                        <Badge
                            variant="secondary"
                            className="absolute top-2 left-2"
                        >
                            {service.category}
                        </Badge>
                    )}
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
                                    {formatPrice(service.recurringPrice, service.currency)}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        /{service.billingCycle}
                                    </span>
                                </span>
                            )}
                            {hasOneOff && !hasRecurring && (
                                <span className="text-lg font-bold text-secondary">
                                    {formatPrice(service.oneOffPrice, service.currency)}
                                </span>
                            )}
                            {hasOneOff && hasRecurring && (
                                <p className="text-xs text-muted-foreground">
                                    + {formatPrice(service.oneOffPrice, service.currency)} setup
                                </p>
                            )}
                        </div>
                        <Button size="sm" variant="outline" className="gap-1">
                            View Details
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
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
    const [data, setData] = useState<ServicesResponse | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/marketplace/services?page=${page}&limit=20`,
                    { credentials: "include" }
                );
                if (!response.ok) throw new Error("Failed to fetch services");
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, [page]);

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
                            {data?.pagination.total || 0} services available
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

            {!isLoading && !error && data && data.services.length === 0 && (
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

            {!isLoading && !error && data && data.services.length > 0 && (
                <>
                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {data.services.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </motion.div>

                    {/* Pagination */}
                    {data.pagination.totalPages > 1 && (
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center justify-center gap-2 pt-6"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground px-4">
                                Page {page} of {data.pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= data.pagination.totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </motion.div>
                    )}
                </>
            )}
        </motion.div>
    );
}
