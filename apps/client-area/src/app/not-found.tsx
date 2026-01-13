"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
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
                        <div className="w-16 h-16 bg-premium-purple rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* 404 Animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.7, ease: "backOut" }}
                        className="mb-6"
                    >
                        <div className="text-8xl font-bold bg-gradient-to-r from-royal-blue to-premium-purple bg-clip-text text-transparent">
                            404
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
                                    Page not found
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="text-gray-500 mb-6 leading-relaxed"
                                >
                                    Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved, deleted, or doesn&apos;t exist.
                                </motion.p>

                                {/* Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    className="flex flex-col sm:flex-row gap-3"
                                >
                                    <Button
                                        className="bg-premium-purple hover:bg-premium-purple-dark text-white flex-1"
                                        asChild
                                    >
                                        <Link href="/">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            Go home
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1"
                                        onClick={() => window.history.back()}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Go back
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Floating Elements */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                    >
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-royal-blue/20' : 'bg-premium-purple/20'}`}
                                style={{
                                    left: `${20 + (i * 15)}%`,
                                    top: `${30 + (i * 10)}%`,
                                }}
                                animate={{
                                    y: [0, -20, 0],
                                    opacity: [0.2, 0.8, 0.2],
                                }}
                                transition={{
                                    duration: 3 + i * 0.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}