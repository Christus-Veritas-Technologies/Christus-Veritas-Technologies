"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Storefront,
    Package,
    Wrench,
    ArrowRight,
    Star,
    CurrencyDollar,
} from "@phosphor-icons/react";

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

interface Product {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    price: number;
    currency: string;
    category: string | null;
    isFeatured: boolean;
}

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
}

function formatPrice(cents: number, currency: string = "USD") {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(cents / 100);
}

function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
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
                            className="w-12 h-12 text-gray-300"
                        />
                    </div>
                )}
                {product.isFeatured && (
                    <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-500 gap-1">
                        <Star weight="fill" className="w-3 h-3" />
                        Featured
                    </Badge>
                )}
            </div>
            <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {product.description}
                    </p>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price, product.currency)}
                    </span>
                    <Button size="sm" variant="outline" className="gap-1">
                        View
                        <ArrowRight className="w-3 h-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function ServiceCard({ service }: { service: MarketplaceService }) {
    const hasRecurring = service.recurringPrice > 0;
    const hasOneOff = service.oneOffPrice > 0;

    return (
        <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
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
                        View
                        <ArrowRight className="w-3 h-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <Skeleton className="aspect-video" />
                            <CardContent className="p-4 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <div className="flex justify-between pt-2">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function MarketplacePage() {
    const [data, setData] = useState<MarketplaceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMarketplace = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/marketplace`,
                    { credentials: "include" }
                );
                if (!response.ok) throw new Error("Failed to fetch marketplace data");
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMarketplace();
    }, []);

    const hasProducts = data && data.products.items.length > 0;
    const hasServices = data && data.services.items.length > 0;
    const isEmpty = !hasProducts && !hasServices;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Storefront weight="duotone" className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                        <p className="text-muted-foreground">
                            Explore products and services from CVT
                        </p>
                    </div>
                </div>
            </motion.div>

            {isLoading && <LoadingSkeleton />}

            {error && (
                <motion.div variants={itemVariants}>
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
                </motion.div>
            )}

            {!isLoading && !error && isEmpty && (
                <motion.div variants={itemVariants}>
                    <Card className="border-dashed">
                        <CardContent className="p-12 text-center">
                            <Storefront
                                weight="duotone"
                                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No Items Available
                            </h3>
                            <p className="text-muted-foreground">
                                Check back later for new products and services.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Products Section */}
            {hasProducts && (
                <motion.div variants={itemVariants} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Package weight="duotone" className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                            <Badge variant="secondary" className="ml-2">
                                {data!.products.total}
                            </Badge>
                        </div>
                        {data!.products.hasMore && (
                            <Link href="/dashboard/marketplace/products">
                                <Button variant="ghost" className="gap-1 text-primary">
                                    See all
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {data!.products.items.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Services Section */}
            {hasServices && (
                <motion.div variants={itemVariants} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wrench weight="duotone" className="w-5 h-5 text-secondary" />
                            <h2 className="text-xl font-semibold text-gray-900">Services</h2>
                            <Badge variant="secondary" className="ml-2">
                                {data!.services.total}
                            </Badge>
                        </div>
                        {data!.services.hasMore && (
                            <Link href="/dashboard/marketplace/services">
                                <Button variant="ghost" className="gap-1 text-secondary">
                                    See all
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {data!.services.items.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
