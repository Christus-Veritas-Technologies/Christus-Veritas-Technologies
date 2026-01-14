"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { House, ArrowLeft } from "@phosphor-icons/react";

export default function NotFound() {
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

                {/* 404 Text */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    className="mb-6"
                >
                    <h1 className="text-7xl font-bold text-gray-200 mb-2">404</h1>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Page not found
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
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
                        asChild
                    >
                        <Link href="/">
                            <House weight="bold" className="w-4 h-4" />
                            Go home
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft weight="bold" className="w-4 h-4" />
                        Go back
                    </Button>
                </motion.div>
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
