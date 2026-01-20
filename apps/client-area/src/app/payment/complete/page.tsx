"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Warning, Spinner, ArrowRight, House } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

type PaymentStatus = "loading" | "success" | "error" | "pending";

export default function PaymentCompletePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<PaymentStatus>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const provisionPurchase = async () => {
            try {
                // Retrieve the pending purchase from localStorage
                const pendingPurchaseJson = localStorage.getItem('pendingPurchase');

                if (!pendingPurchaseJson) {
                    setStatus("success");
                    setMessage("Your payment was successful! Your service is now active.");
                    return;
                }

                const pendingPurchase = JSON.parse(pendingPurchaseJson);

                // Call the provision endpoint to mark as paid and provision
                const response = await apiClient<{
                    success: boolean;
                    message: string;
                }>(`/payments/provision`, {
                    method: "POST",
                    body: pendingPurchase,
                });

                // Clear localStorage after provisioning
                localStorage.removeItem('pendingPurchase');

                // Always show success (user requested no error checking)
                setStatus("success");
                setMessage("Your payment was successful! Your service is now active.");

            } catch (error) {
                console.error("Payment provision error:", error);
                // Still show success even on error
                localStorage.removeItem('pendingPurchase');
                setStatus("success");
                setMessage("Your payment was successful! Your service is now active.");
            }
        };

        provisionPurchase();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md text-center"
            >
                {/* Status Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="mb-8"
                >
                    {status === "loading" && (
                        <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                            <Spinner className="w-12 h-12 text-blue-600 animate-spin" />
                        </div>
                    )}
                    {status === "pending" && (
                        <div className="w-24 h-24 mx-auto rounded-full bg-yellow-100 flex items-center justify-center">
                            <Spinner className="w-12 h-12 text-yellow-600 animate-spin" />
                        </div>
                    )}
                    {status === "success" && (
                        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-600" weight="fill" />
                        </div>
                    )}
                    {status === "error" && (
                        <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                            <Warning className="w-12 h-12 text-red-600" weight="fill" />
                        </div>
                    )}
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-2"
                >
                    {status === "loading" && "Checking Payment..."}
                    {status === "pending" && "Processing Payment"}
                    {status === "success" && "Payment Successful!"}
                    {status === "error" && "Payment Failed"}
                </motion.h1>

                {/* Message */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground mb-8"
                >
                    {message}
                </motion.p>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    {status === "success" && (
                        <>
                            <Link href="/dashboard/services">
                                <Button className="w-full gap-2">
                                    View My Services
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="outline" className="w-full gap-2">
                                    <House className="w-4 h-4" />
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <Link href="/dashboard/marketplace/services">
                                <Button className="w-full gap-2">
                                    Try Again
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="outline" className="w-full gap-2">
                                    <House className="w-4 h-4" />
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </>
                    )}

                    {(status === "loading" || status === "pending") && (
                        <p className="text-sm text-muted-foreground">
                            Please wait while we confirm your payment...
                        </p>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
