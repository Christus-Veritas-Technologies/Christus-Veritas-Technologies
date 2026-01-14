"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus("error");
                setMessage("No verification token provided");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/auth/verify-email`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setStatus("success");
                    setMessage("Your email has been verified successfully!");
                    // Clear the pending email
                    localStorage.removeItem('pendingVerificationEmail');
                } else {
                    setStatus("error");
                    setMessage(data.message || "Failed to verify email. The link may have expired.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("An error occurred while verifying your email");
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                            {status === "loading" && (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"
                                />
                            )}
                            {status === "success" && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <svg
                                        className="w-10 h-10 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </motion.div>
                            )}
                            {status === "error" && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <svg
                                        className="w-10 h-10 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </motion.div>
                            )}
                        </div>
                        <CardTitle className="text-2xl">
                            {status === "loading" && "Verifying Email..."}
                            {status === "success" && "Email Verified!"}
                            {status === "error" && "Verification Failed"}
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                            {message}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        {status === "success" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-4"
                            >
                                <p className="text-muted-foreground">
                                    You can now sign in to your account and access the portal.
                                </p>
                                <Button
                                    className="w-full"
                                    onClick={() => router.push("/auth/signin")}
                                >
                                    Sign In to Your Account
                                </Button>
                            </motion.div>
                        )}
                        {status === "error" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-4"
                            >
                                <p className="text-sm text-muted-foreground">
                                    The verification link may have expired or already been used.
                                    Please request a new verification email.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => router.push("/auth/signin")}
                                    >
                                        Go to Sign In
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-sm text-muted-foreground mt-6"
                >
                    © {new Date().getFullYear()} Christus Veritas Technologies
                </motion.p>
            </motion.div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
