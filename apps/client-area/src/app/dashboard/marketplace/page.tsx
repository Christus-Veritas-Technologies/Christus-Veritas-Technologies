"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClientWithAuth } from "@/lib/api-client";
import { Wrench, Package, Stack } from "@phosphor-icons/react";
import { Info, ArrowRight } from "lucide-react";
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

interface Product {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    price: number;
    currency: string;
    isFeatured: boolean;
}

interface PackageVariant {
    id: string;
    name: string;
    priceOverride: number | null;
    isDefault: boolean;
    items: {
        quantity: number;
        priceOverride: number | null;
        product: { price: number };
    }[];
}

interface PackageData {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    category: string | null;
    isFeatured: boolean;
    variants: PackageVariant[];
}

interface MarketplaceData {
    products: {
        items: Product[];
        total: number;
        hasMore: boolean;
    };
    services: {
        items: MarketplaceService[];
        total: number;
        hasMore: boolean;
    };
    packages: {
        items: PackageData[];
        total: number;
        hasMore: boolean;
    };
}

function ProductCard({ product }: { product: Product }) {
    const router = useRouter();

    return (
        <div
            className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => router.push(`/dashboard/marketplace/products/${product.id}`)}
        >
            {/* Image Section */}
            <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package
                            weight="duotone"
                            className="w-20 h-20 text-gray-300 dark:text-gray-500"
                        />
                    </div>
                )}

                {/* Price Badge Overlay */}
                <div className="absolute top-4 left-4">
                    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            ${(product.price / 100).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                        {product.name}
                    </h3>
                    {product.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Product Badge */}
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                        <Package className="w-3 h-3 mr-1" weight="fill" />
                        Product
                    </Badge>
                </div>

                {/* View Button */}
                <Button
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/marketplace/products/${product.id}`);
                    }}
                >
                    View Product
                </Button>
            </div>
        </div>
    );
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
            <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
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

function PackageCard({ pkg }: { pkg: PackageData }) {
    const router = useRouter();

    // Calculate price from default variant or first variant
    const defaultVariant = pkg.variants.find((v) => v.isDefault) || pkg.variants[0];
    const calculatePrice = (variant: PackageVariant): number => {
        if (variant.priceOverride) return variant.priceOverride;
        return variant.items.reduce((sum, item) => {
            const price = item.priceOverride ?? item.product.price;
            return sum + price * item.quantity;
        }, 0);
    };
    const price = defaultVariant ? calculatePrice(defaultVariant) : 0;

    return (
        <div
            className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => router.push(`/dashboard/marketplace/packages/${pkg.id}`)}
        >
            {/* Image Section */}
            <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600">
                {pkg.imageUrl ? (
                    <img
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Stack
                            weight="duotone"
                            className="w-20 h-20 text-purple-200 dark:text-gray-500"
                        />
                    </div>
                )}

                {/* Price Badge Overlay */}
                {price > 0 && (
                    <div className="absolute top-4 left-4">
                        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                ${(price / 100).toFixed(2)}
                                {pkg.variants.length > 1 && (
                                    <span className="text-xs font-normal text-gray-500 ml-1">+</span>
                                )}
                            </p>
                        </div>
                    </div>
                )}

                {/* Variants Badge */}
                {pkg.variants.length > 1 && (
                    <div className="absolute top-4 right-4">
                        <div className="bg-purple-600 px-2 py-1 rounded-full shadow-lg">
                            <p className="text-xs font-medium text-white">
                                {pkg.variants.length} options
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                        {pkg.name}
                    </h3>
                    {pkg.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                            {pkg.description}
                        </p>
                    )}
                </div>

                {/* Package Badge */}
                <div className="flex items-center gap-2">
                    <Badge className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        <Stack className="w-3 h-3 mr-1" weight="fill" />
                        Package
                    </Badge>
                    {pkg.category && (
                        <Badge variant="outline" className="text-xs">
                            {pkg.category}
                        </Badge>
                    )}
                </div>

                {/* View Button */}
                <Button
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/marketplace/packages/${pkg.id}`);
                    }}
                >
                    View Package
                </Button>
            </div>
        </div>
    );
}

export default function MarketplacePage() {
    const router = useRouter();
    const [data, setData] = useState<MarketplaceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMarketplaceData();
    }, []);

    const fetchMarketplaceData = async () => {
        try {
            const response = await apiClientWithAuth<MarketplaceData>("/marketplace");
            if (response.data) {
                console.log("Marketplace services:", response.data.services?.items);
                console.log("Marketplace products:", response.data.products?.items);
                setData(response.data);
            }
        } catch (error) {
            console.error("Error fetching marketplace data:", error);
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-4/3 mb-4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Marketplace
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Discover and subscribe to professional services
                </p>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="animate-pulse">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="animate-pulse">
                                            <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-4/3 mb-4"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Packages Section */}
                    {data?.packages && data.packages.items.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Packages
                                </h2>
                                {data.packages.hasMore && (
                                    <Link href="/dashboard/marketplace/packages">
                                        <Button variant="ghost" className="gap-2">
                                            View All ({data.packages.total})
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {data.packages.items.slice(0, 10).map((pkg) => (
                                    <PackageCard key={pkg.id} pkg={pkg} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products Section */}
                    {data?.products && data.products.items.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Products
                                </h2>
                                {data.products.hasMore && (
                                    <Link href="/dashboard/marketplace/products">
                                        <Button variant="ghost" className="gap-2">
                                            View All ({data.products.total})
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {data.products.items.slice(0, 10).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Services Section */}
                    {data?.services && data.services.items.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Services
                                </h2>
                                {data.services.hasMore && (
                                    <Link href="/dashboard/marketplace/services">
                                        <Button variant="ghost" className="gap-2">
                                            View All ({data.services.total})
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {data.services.items.slice(0, 10).map((service) => (
                                    <ServiceCard key={service.id} service={service} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {(!data?.products?.items?.length && !data?.services?.items?.length && !data?.packages?.items?.length) && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Wrench
                                weight="duotone"
                                className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No items available
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Check back later for new products and services
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
