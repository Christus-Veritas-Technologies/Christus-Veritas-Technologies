"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClientWithAuth } from "@/lib/api-client";
import { Wrench, Package, CheckCircle } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MarketplaceService {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    oneOffPrice: number | null;
    recurringPrice: number | null;
    recurringPricePerUnit: boolean;
    billingCycleDays: number;
    isActive: boolean;
}

interface MarketplaceData {
    services: {
        items: MarketplaceService[];
        total: number;
    };
}

function ServiceCard({ service }: { service: MarketplaceService }) {
    const router = useRouter();
    const hasRecurring = service.recurringPrice && service.recurringPrice > 0;
    const hasOneOff = service.oneOffPrice && service.oneOffPrice > 0;

    const billingCycleText = service.billingCycleDays === 30 ? "month"
        : service.billingCycleDays === 7 ? "week"
            : service.billingCycleDays === 365 ? "year"
                : `${service.billingCycleDays} days`;

    return (
        <div
            className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => router.push(`/dashboard/marketplace/services/${service.id}`)}
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
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
                            className="w-20 h-20 text-blue-200 dark:text-gray-500"
                        />
                    </div>
                )}

                {/* Price Badge Overlay */}
                {hasRecurring && (
                    <div className="absolute top-4 left-4">
                        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                ${(service.recurringPrice! / 100).toFixed(2)}
                                {service.recurringPricePerUnit && <span className="text-xs">/unit</span>}
                                <span className="text-xs font-normal text-gray-500 dark:text-gray-400"> /{billingCycleText}</span>
                            </p>
                        </div>
                    </div>
                )}

                {hasOneOff && !hasRecurring && (
                    <div className="absolute top-4 left-4">
                        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                ${(service.oneOffPrice! / 100).toFixed(2)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                        {service.name}
                    </h3>
                    {service.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                            {service.description}
                        </p>
                    )}
                </div>

                {/* Action Section */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                            <Package className="w-3 h-3 mr-1" weight="fill" />
                            Service
                        </Badge>
                    </div>
                    <Button
                        size="sm"
                        className="group-hover:bg-primary group-hover:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/marketplace/services/${service.id}`);
                        }}
                    >
                        Sign Up
                    </Button>
                </div>

                {hasOneOff && hasRecurring && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <CheckCircle weight="fill" className="w-3 h-3" />
                        ${(service.oneOffPrice! / 100).toFixed(2)} one-time setup fee
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MarketplacePage() {
    const [services, setServices] = useState<MarketplaceService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await apiClientWithAuth<MarketplaceData>("/marketplace");
            setServices(response.data.services.items);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-[4/3] mb-4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Marketplace
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Discover and subscribe to professional services
                </p>
            </div>

            {/* Services Grid */}
            {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20">
                    <Wrench
                        weight="duotone"
                        className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No services available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Check back later for new services
                    </p>
                </div>
            )}
        </div>
    );
}
