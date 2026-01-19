"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClientWithAuth } from "@/lib/api-client";
import { Wrench, Package, ArrowLeft } from "@phosphor-icons/react";
import { Info } from "lucide-react";
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

interface ServiceResponse {
    services: MarketplaceService[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
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

                {/* Service Badge */}
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                        <Package className="w-3 h-3 mr-1" weight="fill" />
                        Service
                    </Badge>
                </div>

                {/* Sign Up Button */}
                <Button
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/marketplace/services/${service.id}`);
                    }}
                >
                    Sign Up
                </Button>

                {/* One-time Setup Fee */}
                {hasOneOff && hasRecurring && (
                    <div className="text-xs text-yellow-500 flex items-center justify-center gap-1">
                        <Info className="w-3 h-3" />
                        ${(service.oneOffPrice! / 100).toFixed(2)} one-time setup fee
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AllServicesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const [services, setServices] = useState<MarketplaceService[]>([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices(page);
    }, [page]);

    const fetchServices = async (pageNum: number) => {
        try {
            setLoading(true);
            const response = await apiClientWithAuth<ServiceResponse>(`/marketplace/services?page=${pageNum}&limit=10`);
            setServices(response.data.services);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        router.push(`?page=${newPage}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/dashboard/marketplace">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        All Services
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Showing {services.length > 0 ? (page - 1) * 10 + 1 : 0} to {Math.min(page * 10, pagination.total)} of {pagination.total} services
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-[4/3] mb-4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Services Grid */}
                    {services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                                No services found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Check back later for new services
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-8">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Page {pagination.page} of {pagination.totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.page === 1}
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                >
                                    Previous
                                </Button>
                                {[...Array(pagination.totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={pageNum === pagination.page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.page === pagination.totalPages}
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
