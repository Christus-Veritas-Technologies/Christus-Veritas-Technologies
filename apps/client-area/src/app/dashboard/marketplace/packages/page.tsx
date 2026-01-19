"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClientWithAuth } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Stack, ChevronLeft, ChevronRight } from "@phosphor-icons/react";

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

interface PackagesResponse {
  packages: PackageData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function PackageCard({ pkg }: { pkg: PackageData }) {
  const router = useRouter();

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
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600">
        {pkg.imageUrl ? (
          <img
            src={pkg.imageUrl}
            alt={pkg.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Stack weight="duotone" className="w-20 h-20 text-purple-200 dark:text-gray-500" />
          </div>
        )}

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

        {pkg.variants.length > 1 && (
          <div className="absolute top-4 right-4">
            <div className="bg-purple-600 px-2 py-1 rounded-full shadow-lg">
              <p className="text-xs font-medium text-white">{pkg.variants.length} options</p>
            </div>
          </div>
        )}
      </div>

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

export default function PackagesListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [data, setData] = useState<PackagesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, [currentPage]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await apiClientWithAuth<PackagesResponse>(
        `/marketplace/packages?page=${currentPage}&limit=10`
      );
      if (res.ok && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    router.push(`/dashboard/marketplace/packages?page=${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/marketplace")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Packages</h1>
          {data && (
            <p className="text-gray-500 text-sm">
              Showing {(currentPage - 1) * 10 + 1}-
              {Math.min(currentPage * 10, data.pagination.total)} of {data.pagination.total}{" "}
              packages
            </p>
          )}
        </div>
      </div>

      {data?.packages && data.packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {data.packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Stack weight="duotone" className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No packages available
          </h3>
          <p className="text-gray-500">Check back later for new packages</p>
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (data.pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= data.pagination.totalPages - 2) {
                pageNum = data.pagination.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === data.pagination.totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
