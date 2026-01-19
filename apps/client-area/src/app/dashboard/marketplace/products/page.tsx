"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClientWithAuth } from "@/lib/api-client";
import { Package, ArrowLeft } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Product {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    price: number;
    currency: string;
    isFeatured: boolean;
}

interface ProductResponse {
    products: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
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
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
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

export default function AllProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const fetchProducts = async (pageNum: number) => {
        try {
            setLoading(true);
            const response = await apiClientWithAuth<ProductResponse>(`/marketplace/products?page=${pageNum}&limit=10`);
            setProducts(response.data.products);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Error fetching products:", error);
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
                        All Products
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Showing {products.length > 0 ? (page - 1) * 10 + 1 : 0} to {Math.min(page * 10, pagination.total)} of {pagination.total} products
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
                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Package
                                weight="duotone"
                                className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No products found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Check back later for new products
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
