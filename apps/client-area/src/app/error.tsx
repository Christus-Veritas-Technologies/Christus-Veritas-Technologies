"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Error Icon Animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                            delay: 0.3,
                            duration: 0.7,
                            ease: "backOut",
                            rotate: { duration: 0.5 }
                        }}
                        className="mb-6"
                    >
                        <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                            <motion.svg
                                className="w-10 h-10 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </motion.svg>
                        </div>
                    </motion.div>

                    {/* Content Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <Card className="border-0 shadow-lg bg-gray-50/50">
                            <CardContent className="p-8">
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="text-2xl font-bold text-gray-900 mb-3"
                                >
                                    Something went wrong!
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="text-gray-500 mb-2 leading-relaxed"
                                >
                                    We encountered an unexpected error while processing your request.
                                </motion.p>

                                {error.message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7, duration: 0.5 }}
                                        className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
                                    >
                                        <p className="text-sm text-red-700 font-mono break-words">
                                            {error.message}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className="flex flex-col sm:flex-row gap-3"
                                >
                                    <Button
                                        onClick={reset}
                                        className="bg-premium-purple hover:bg-premium-purple-dark text-white flex-1"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Try again
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1"
                                        asChild
                                    >
                                        <Link href="/">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            Go home
                                        </Link>
                                    </Button>
                                </motion.div>

                                {/* Additional Help */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="mt-4 text-xs text-gray-400"
                                >
                                    If this error persists, please contact our support team.
                                </motion.p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Floating Error Particles */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                    >
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-3 h-3 rounded-full bg-red-300/30"
                                style={{
                                    left: `${25 + (i * 20)}%`,
                                    top: `${40 + (i * 5)}%`,
                                }}
                                animate={{
                                    y: [0, -30, 0],
                                    x: [0, Math.sin(i) * 20, 0],
                                    opacity: [0.3, 0.8, 0.3],
                                }}
                                transition={{
                                    duration: 4 + i * 0.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.3,
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}