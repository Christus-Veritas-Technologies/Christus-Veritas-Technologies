"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClientWithAuth } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Stack,
    ArrowLeft,
    Check,
    ShoppingCart,
    Package,
} from "@phosphor-icons/react";

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
}

interface PackageItem {
    id: string;
    productId: string;
    quantity: number;
    priceOverride: number | null;
    product: Product;
}

interface PackageVariant {
    id: string;
    name: string;
    description: string | null;
    priceOverride: number | null;
    isDefault: boolean;
    items: PackageItem[];
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

export default function PackageDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [pkg, setPkg] = useState<PackageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

    useEffect(() => {
        fetchPackage();
    }, [params.id]);

    const fetchPackage = async () => {
        try {
            const res = await apiClientWithAuth<PackageData>(`/marketplace/packages/${params.id}`);
            if (res.ok && res.data) {
                setPkg(res.data);
                // Select default variant or first one
                const defaultVariant = res.data.variants.find((v) => v.isDefault) || res.data.variants[0];
                if (defaultVariant) {
                    setSelectedVariantId(defaultVariant.id);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const calculateVariantPrice = (variant: PackageVariant): number => {
        if (variant.priceOverride) return variant.priceOverride;
        return variant.items.reduce((sum, item) => {
            const price = item.priceOverride ?? item.product.price;
            return sum + price * item.quantity;
        }, 0);
    };

    const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

    const selectedVariant = pkg?.variants.find((v) => v.id === selectedVariantId);

    if (loading) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <Skeleton className="h-8 w-32 mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="aspect-square rounded-2xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Package not found</h2>
                <Button onClick={() => router.push("/dashboard/marketplace")}>
                    Back to Marketplace
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => router.push("/dashboard/marketplace")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft weight="bold" className="w-4 h-4" />
                Back to Marketplace
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                    {pkg.imageUrl ? (
                        <img
                            src={pkg.imageUrl}
                            alt={pkg.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Stack
                                weight="duotone"
                                className="w-32 h-32 text-purple-200 dark:text-gray-500"
                            />
                        </div>
                    )}
                    {pkg.isFeatured && (
                        <Badge className="absolute top-4 left-4 bg-yellow-500">Featured</Badge>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                <Stack className="w-3 h-3 mr-1" weight="fill" />
                                Package
                            </Badge>
                            {pkg.category && (
                                <Badge variant="outline">{pkg.category}</Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {pkg.name}
                        </h1>
                        {pkg.description && (
                            <p className="mt-3 text-gray-600 dark:text-gray-300 text-lg">
                                {pkg.description}
                            </p>
                        )}
                    </div>

                    {/* Variant Selection */}
                    {pkg.variants.length > 1 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Choose your configuration
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {pkg.variants.map((variant) => {
                                    const price = calculateVariantPrice(variant);
                                    const isSelected = selectedVariantId === variant.id;

                                    return (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariantId(variant.id)}
                                            className={`relative p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                                    ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {variant.name}
                                                        </span>
                                                        {variant.isDefault && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Popular
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {variant.description && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            {variant.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {formatCurrency(price)}
                                                    </span>
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-3 right-3">
                                                    <Check weight="bold" className="w-5 h-5 text-purple-600" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Selected Variant Price */}
                    {selectedVariant && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Total Price</span>
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(calculateVariantPrice(selectedVariant))}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* What's Included */}
                    {selectedVariant && selectedVariant.items.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                What&apos;s included
                            </h3>
                            <div className="space-y-2">
                                {selectedVariant.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                            {item.product.imageUrl ? (
                                                <img
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package
                                                        weight="duotone"
                                                        className="w-5 h-5 text-gray-400"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                                {item.product.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency((item.priceOverride ?? item.product.price) * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Purchase Button */}
                    <Button
                        size="lg"
                        className="w-full py-6 text-lg"
                        disabled={!selectedVariant}
                    >
                        <ShoppingCart weight="bold" className="w-5 h-5 mr-2" />
                        Purchase Package
                    </Button>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Contact us for installation and setup assistance
                    </p>
                </div>
            </div>
        </div>
    );
}
