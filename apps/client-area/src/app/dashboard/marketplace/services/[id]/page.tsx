"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
    ArrowLeft,
    Check,
    ShoppingCart,
    Spinner,
    CreditCard,
    Clock,
} from "@phosphor-icons/react";
import { apiClientWithAuth } from "@/lib/api-client";
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

        if (service.oneOffPrice) {
            total += service.oneOffPrice;
        }

        if (enableRecurring && service.recurringPrice) {
            const recurringAmount = service.recurringPricePerUnit
                ? service.recurringPrice * units
                : service.recurringPrice;
            total += recurringAmount;
        }

        return total;
    };

    const handleSubscribe = async () => {
        if (!service) return;

        setIsProvisioning(true);
        try {
            // First, provision the service
            const provisionResponse = await apiClientWithAuth<{ id: string }>("/services/provision", {
                method: "POST",
                body: {
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
            <div className="p-6 space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="p-6">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-600">{error || "Service not found"}</p>
                        <Link href="/dashboard/marketplace/services">
                            <Button variant="outline" className="mt-4">
                                Back to Services
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const hasRecurring = service.recurringPrice && service.recurringPrice > 0;
    const hasOneOff = service.oneOffPrice && service.oneOffPrice > 0;

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <Link href="/dashboard/marketplace/services">
                <Button variant="ghost" size="sm" className="gap-1 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Services
                </Button>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Service Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{service.name}</CardTitle>
                        {service.description && (
                            <CardDescription className="text-base mt-2">
                                {service.description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Pricing Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {hasOneOff && (
                                <Card className="bg-gray-50 dark:bg-gray-800/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                            <CreditCard className="w-4 h-4" />
                                            <span className="text-sm font-medium">One-time Setup</span>
                                        </div>
                                        <p className="text-2xl font-bold text-secondary">
                                            {formatPrice(service.oneOffPrice!, "USD")}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                            {hasRecurring && (
                                <Card className="bg-gray-50 dark:bg-gray-800/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm font-medium">Recurring Price</span>
                                        </div>
                                        <p className="text-2xl font-bold text-secondary">
                                            {formatPrice(service.recurringPrice!, "USD")}
                                            {service.recurringPricePerUnit && <span className="text-sm">/unit</span>}
                                            <span className="text-base font-normal text-muted-foreground">
                                                {" "}per {billingCycleText}
                                            </span>
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Features/Benefits */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">What's Included</h3>
                            <ul className="space-y-2">
                                {hasRecurring && (
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">
                                            Recurring billing every {billingCycleText}
                                        </span>
                                    </li>
                                )}
                                {hasOneOff && (
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">
                                            One-time setup included
                                        </span>
                                    </li>
                                )}
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">
                                        Professional support
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Subscribe to Service</CardTitle>
                        <CardDescription>
                            Configure your subscription options
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Units (if price per unit) */}
                        {service.recurringPricePerUnit && hasRecurring && (
                            <div className="space-y-2">
                                <Label htmlFor="units">Number of Units</Label>
                                <Input
                                    id="units"
                                    type="number"
                                    min="1"
                                    value={units}
                                    onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Recurring cost: {formatPrice(service.recurringPrice! * units, "USD")}/{billingCycleText}
                                </p>
                            </div>
                        )}

                        {/* Enable Recurring */}
                        {hasRecurring && (
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <div>
                                    <p className="font-medium">Enable Recurring Billing</p>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically bill every {billingCycleText}
                                    </p>
                                </div>
                                <Switch
                                    checked={enableRecurring}
                                    onCheckedChange={setEnableRecurring}
                                />
                            </div>
                        )}

                        {/* Payment Method */}
                        <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <Card
                                    className={`cursor-pointer transition-all ${paymentMethod === "online"
                                            ? "border-primary bg-primary/5"
                                            : "hover:border-gray-400"
                                        }`}
                                    onClick={() => setPaymentMethod("online")}
                                >
                                    <CardContent className="p-4 text-center">
                                        <CreditCard className="w-6 h-6 mx-auto mb-2" />
                                        <p className="font-medium">Online Payment</p>
                                    </CardContent>
                                </Card>
                                <Card
                                    className={`cursor-pointer transition-all ${paymentMethod === "cash"
                                            ? "border-primary bg-primary/5"
                                            : "hover:border-gray-400"
                                        }`}
                                    onClick={() => setPaymentMethod("cash")}
                                >
                                    <CardContent className="p-4 text-center">
                                        <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
                                        <p className="font-medium">Cash Payment</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-semibold">Total</span>
                                <span className="text-2xl font-bold text-secondary">
                                    {formatPrice(calculateTotal(), "USD")}
                                </span>
                            </div>
                            <Button
                                className="w-full gap-2"
                                size="lg"
                                onClick={handleSubscribe}
                                disabled={isProvisioning}
                            >
                                {isProvisioning ? (
                                    <>
                                        <Spinner className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-4 h-4" />
                                        {paymentMethod === "cash" ? "Subscribe (Cash Payment)" : "Subscribe & Pay"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
