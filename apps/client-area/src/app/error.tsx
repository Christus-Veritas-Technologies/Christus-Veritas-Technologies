"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { House, ArrowClockwise, Warning } from "@phosphor-icons/react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md"
            >
                {/* CVT Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="mb-8"
                >
                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                        <span className="text-white font-bold text-xl tracking-tight">CVT</span>
                    </div>
                </motion.div>

                {/* Error Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-6"
                >
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                        <Warning weight="duotone" className="w-8 h-8 text-red-500" />
                    </div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        We encountered an unexpected error. Please try again or contact support if the problem persists.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <Button
                        className="bg-primary hover:bg-primary/90 text-white gap-2"
                        onClick={reset}
                    >
                        <ArrowClockwise weight="bold" className="w-4 h-4" />
                        Try again
                    </Button>

                    <Button
                        variant="outline"
                        className="gap-2"
                        asChild
                    >
                        <Link href="/">
                            <House weight="bold" className="w-4 h-4" />
                            Go home
                        </Link>
                    </Button>
                </motion.div>

                {/* Error Details (Development) */}
                {process.env.NODE_ENV === "development" && error?.message && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mt-8 p-4 bg-gray-50 rounded-lg text-left"
                    >
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Error Details</p>
                        <p className="text-sm text-gray-600 font-mono break-all">{error.message}</p>
                    </motion.div>
                )}
            </motion.div>

            {/* Footer Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute bottom-8 text-center"
            >
                <p className="text-gray-300 text-xs tracking-widest uppercase">
                    Christus Veritas Technologies
                </p>
            </motion.div>
        </div>
    );
}
