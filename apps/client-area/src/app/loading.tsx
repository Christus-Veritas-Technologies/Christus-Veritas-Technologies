"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center">
            {/* Logo Container */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                {/* CVT Logo */}
                <motion.div
                    className="relative mb-6"
                    animate={{
                        scale: [1, 1.02, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-white font-bold text-2xl tracking-tight">CVT</span>
                    </div>

                    {/* Pulse ring */}
                    <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-primary/30"
                        animate={{
                            scale: [1, 1.3, 1.3],
                            opacity: [0.6, 0, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                    />
                </motion.div>

                {/* Loading Spinner */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <motion.div
                        className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </motion.div>

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-center"
                >
                    <p className="text-gray-400 text-sm tracking-wide">
                        Loading...
                    </p>
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
