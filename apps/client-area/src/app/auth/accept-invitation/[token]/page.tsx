"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AcceptInvitationPage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const [userInfo, setUserInfo] = useState<{ email: string; name: string } | null>(null);

    useEffect(() => {
        const acceptInvitation = async () => {
            try {
                const response = await fetch(`${API_URL}/invitations/accept/${token}`, {
                    method: "POST",
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus("success");
                    setUserInfo({ email: data.email, name: data.name });
                    setMessage("Your account has been created successfully!");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Failed to accept invitation");
                }
            } catch (error) {
                setStatus("error");
                setMessage("An error occurred while accepting the invitation");
            }
        };

        if (token) {
            acceptInvitation();
        }
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
                                    className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full mx-auto"
                                />
                            )}
                            {status === "success" && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <svg
                                        className="w-8 h-8 text-green-600"
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
                                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <svg
                                        className="w-8 h-8 text-red-600"
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
                            {status === "loading" && "Accepting Invitation..."}
                            {status === "success" && "Welcome to Christus Veritas Technologies!"}
                            {status === "error" && "Invitation Error"}
                        </CardTitle>
                        <CardDescription>
                            {message}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        {status === "success" && userInfo && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-4"
                            >
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Your account email:</p>
                                    <p className="font-medium">{userInfo.email}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Check your email for your temporary password. You can change it after signing in.
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
                                    The invitation link may have expired or already been used.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.push("/auth/signin")}
                                >
                                    Go to Sign In
                                </Button>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
