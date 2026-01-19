"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
    ArrowLeft,
    Check,
    Spinner,
} from "@phosphor-icons/react";
import { apiClientWithAuth } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/lib/toast";

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

export default function ServiceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const serviceId = params?.id as string;
    const { user } = useAuth();

    const [service, setService] = useState<ServiceDefinition | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProvisioning, setIsProvisioning] = useState(false);

    // Form state
    const [units, setUnits] = useState(1);
    const [enableRecurring, setEnableRecurring] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online");

    useEffect(() => {
        const fetchService = async () => {
            setIsLoading(true);
            try {
                const response = await apiClientWithAuth<ServiceDefinition[]>(`/services/definitions`);
                if (!response.ok || !response.data) throw new Error("Failed to fetch service");

                const foundService = response.data.find(s => s.id === serviceId);
                if (!foundService) throw new Error("Service not found");

                setService(foundService);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };
        fetchService();
    }, [serviceId]);

    const calculateTotal = () => {
        if (!service) return 0;

        let total = 0;

        // One-time setup price is always per unit
        if (service.oneOffPrice) {
            total += service.oneOffPrice * units;
        }

        // Recurring price may or may not be per unit
        if (enableRecurring && service.recurringPrice) {
            const recurringAmount = service.recurringPricePerUnit
                ? service.recurringPrice * units
                : service.recurringPrice;
            total += recurringAmount;
        }

        return total;
    };

    const handleSubscribe = async () => {
        if (!service || !user?.userId) return;

        setIsProvisioning(true);
        try {
            // First, provision the service
            const provisionResponse = await apiClientWithAuth<{ id: string }>("/services/provision", {
                method: "POST",
                body: {
                    userId: user.userId,
                    serviceDefinitionId: service.id,
                    units: service.recurringPricePerUnit ? units : 1,
                    enableRecurring,
                },
            });

            if (!provisionResponse.ok) {
                throw new Error(provisionResponse.error || "Failed to provision service");
            }

            const clientServiceId = provisionResponse.data?.id;

            if (paymentMethod === "cash") {
                // For cash payment, just show success and redirect
                toast.success("Service subscribed! Payment pending confirmation.", "newService");
                router.push("/dashboard/services");
                return;
            }

            // For online payment, initiate payment flow
            const total = calculateTotal();
            const paymentResponse = await apiClientWithAuth<{ redirectUrl?: string }>("/payments/initiate", {
                method: "POST",
                body: {
                    itemType: "SERVICE",
                    itemId: clientServiceId,
                    amount: total,
                    quantity: 1,
                },
            });

            if (!paymentResponse.ok) {
                throw new Error(paymentResponse.error || "Failed to initiate payment");
            }

            if (paymentResponse.data?.redirectUrl) {
                // Redirect to payment page
                window.location.href = paymentResponse.data.redirectUrl;
            } else {
                throw new Error("No payment URL received");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Subscription failed");
            toast.error(err instanceof Error ? err.message : "Subscription failed");
        } finally {
            setIsProvisioning(false);
        }
    };

    const billingCycleText = service?.billingCycleDays === 30 ? "month"
        : service?.billingCycleDays === 7 ? "week"
            : service?.billingCycleDays === 365 ? "year"
                : `${service?.billingCycleDays} days`;

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto py-8 px-4 md:px-0">
                <Skeleton className="h-6 w-32 mb-8" />
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="lg:col-span-1">
                        <Skeleton className="h-96 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="max-w-5xl mx-auto py-20 px-4 text-center">
                <div className="rounded-xl bg-red-50 border border-red-100 p-8 max-w-md mx-auto">
                    <h3 className="text-red-800 font-medium mb-2">Error Loading Service</h3>
                    <p className="text-red-600 mb-6">{error || "Service not found"}</p>
                    <Link href="/dashboard/marketplace/services">
                        <Button variant="outline" className="bg-white hover:bg-red-50 border-red-200 text-red-700">
                            Back to Services
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const hasRecurring = service.recurringPrice && service.recurringPrice > 0;
    const hasOneOff = service.oneOffPrice && service.oneOffPrice > 0;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 md:px-6">
            <Link href="/dashboard/marketplace/services" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-3 gap-12"
            >
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
                            {service.name}
                        </h1>
                        {service.description && (
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">What's included</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {hasRecurring && (
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-50 rounded-full p-1">
                                        <Check className="w-4 h-4 text-green-600" weight="bold" />
                                    </div>
                                    <span className="text-gray-600">
                                        Recurring billing every {billingCycleText}
                                    </span>
                                </div>
                            )}
                            {hasOneOff && (
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-50 rounded-full p-1">
                                        <Check className="w-4 h-4 text-green-600" weight="bold" />
                                    </div>
                                    <span className="text-gray-600">
                                        One-time setup configuration
                                    </span>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-green-50 rounded-full p-1">
                                    <Check className="w-4 h-4 text-green-600" weight="bold" />
                                </div>
                                <span className="text-gray-600">Professional support & maintenance</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-green-50 rounded-full p-1">
                                    <Check className="w-4 h-4 text-green-600" weight="bold" />
                                </div>
                                <span className="text-gray-600">Secure and reliable infrastructure</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Actions */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-6">Subscription Details</h3>

                        <div className="space-y-6">
                            {/* Pricing Breakdown */}
                            <div className="space-y-3 pb-6 border-b border-gray-100">
                                {hasOneOff && (
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">One-time setup</span>
                                            <span className="font-medium text-gray-900">
                                                {formatPrice(service.oneOffPrice!, "USD")}
                                            </span>
                                        </div>
                                        {units > 1 && (
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>×{units} units</span>
                                                <span>{formatPrice(service.oneOffPrice! * units, "USD")}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {hasRecurring && (
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Recurring price</span>
                                            <div className="text-right">
                                                <span className="font-medium text-gray-900">
                                                    {formatPrice(service.recurringPrice!, "USD")}
                                                </span>
                                                <span className="text-gray-500">/{billingCycleText}</span>
                                            </div>
                                        </div>
                                        {service.recurringPricePerUnit && units > 1 && (
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>×{units} units</span>
                                                <span>{formatPrice(service.recurringPrice! * units, "USD")}/{billingCycleText}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-4">
                                {(service.recurringPricePerUnit || (hasOneOff && units > 0)) && (
                                    <div className="space-y-2">
                                        <Label htmlFor="units" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Number of Units</Label>
                                        <Input
                                            id="units"
                                            type="number"
                                            min="1"
                                            value={units}
                                            onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {hasOneOff && service.recurringPricePerUnit ? 'Both setup and recurring are per unit'
                                                : hasOneOff ? 'Setup fee is per unit'
                                                    : service.recurringPricePerUnit ? 'Recurring fee is per unit'
                                                        : ''}
                                        </p>
                                    </div>
                                )}

                                {hasRecurring && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Auto-renew subscription</span>
                                        <Switch
                                            checked={enableRecurring}
                                            onCheckedChange={setEnableRecurring}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Payment Method</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === "online"
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                }`}
                                            onClick={() => setPaymentMethod("online")}
                                        >
                                            Online
                                        </button>
                                        <button
                                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === "cash"
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                }`}
                                            onClick={() => setPaymentMethod("cash")}
                                        >
                                            Cash
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Total & Action */}
                            <div className="pt-2">
                                <div className="flex items-end justify-between mb-6">
                                    <span className="text-sm text-gray-500 mb-1">Total due today</span>
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatPrice(calculateTotal(), "USD")}
                                    </span>
                                </div>
                                <Button
                                    className="w-full h-12 text-base"
                                    onClick={handleSubscribe}
                                    disabled={isProvisioning}
                                >
                                    {isProvisioning ? (
                                        <>
                                            <Spinner className="w-5 h-5 animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        paymentMethod === "cash" ? "Confirm Subscription" : "Pay & Subscribe"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
