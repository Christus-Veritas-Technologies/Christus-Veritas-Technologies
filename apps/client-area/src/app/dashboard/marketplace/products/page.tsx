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
    Package,
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

interface ProductsResponse {
    products: Product[];
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

function ProductCard({ product }: { product: Product }) {
    return (
        <motion.div variants={itemVariants}>
            <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden h-full">
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
                    {product.category && (
                        <Badge
                            variant="secondary"
                            className="absolute top-2 left-2"
                        >
                            {product.category}
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

export default function AllProductsPage() {
    const [data, setData] = useState<ProductsResponse | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/marketplace/products?page=${page}&limit=20`,
                    { credentials: "include" }
                );
                if (!response.ok) throw new Error("Failed to fetch products");
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
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
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package weight="duotone" className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
                        <p className="text-muted-foreground">
                            {data?.pagination.total || 0} products available
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

            {!isLoading && !error && data && data.products.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                        <Package
                            weight="duotone"
                            className="w-16 h-16 text-gray-300 mx-auto mb-4"
                        />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Products Available
                        </h3>
                        <p className="text-muted-foreground">
                            Check back later for new products.
                        </p>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !error && data && data.products.length > 0 && (
                <>
                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {data.products.map((product) => (
                            <ProductCard key={product.id} product={product} />
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
