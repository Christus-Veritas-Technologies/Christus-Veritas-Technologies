"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Sign up failed");
            }

            // Store email for potential resend verification
            localStorage.setItem('pendingVerificationEmail', formData.email);

            // Redirect to success page for email verification
            router.push("/auth/success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" as const },
        },
    };

    const rightSlideVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" as const },
        },
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-lg"
                >
                    {/* Logo */}
                    <motion.div variants={itemVariants} className="mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.div variants={itemVariants}>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Client Portal</h1>
                        <p className="text-gray-500 text-md mb-8">
                            Christus Veritas Technologies - Create your account to access technology services, manage billing, and track your projects.
                        </p>
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <motion.form
                        variants={containerVariants}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Grid container for inputs */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Full Name */}
                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="john doe"
                                    className="h-12"
                                    required
                                />
                            </motion.div>

                            {/* Email */}
                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@gmail.com"
                                    className="h-12"
                                    required
                                />
                            </motion.div>

                            {/* Phone Number */}
                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 890"
                                    className="h-12"
                                />
                            </motion.div>

                            {/* Password */}
                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="min. 8 characters"
                                    className="h-12"
                                    required
                                    minLength={8}
                                />
                            </motion.div>

                            {/* Confirm Password */}
                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="confirm password"
                                    className="h-12"
                                    required
                                    minLength={8}
                                />
                            </motion.div>
                        </div>

                        {/* Submit Button */}
                        <motion.div variants={itemVariants} className="pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                size="lg"
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                            >
                                {isLoading ? "Creating..." : "Create Account"}
                            </Button>
                        </motion.div>
                    </motion.form>

                    {/* Login link */}
                    <motion.p variants={itemVariants} className="mt-6 text-center text-gray-500">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="text-secondary hover:text-secondary/80 font-medium">
                            Login
                        </Link>
                    </motion.p>
                </motion.div>
            </div>

            {/* Right side - Image with Stats Card */}
            <motion.div
                variants={rightSlideVariants}
                initial="hidden"
                animate="visible"
                className="hidden lg:flex flex-1 relative bg-linear-to-br from-primary to-secondary"
            >
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Business team working"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
                </div>

                {/* Stats Card - Positioned at bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.7 }}
                    className="absolute bottom-8 left-8 right-8"
                >
                    <Card className="bg-white shadow-2xl border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Join Our Growing Community</h3>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                                            className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                                        >
                                            {["JD", "AK", "MR", "SP"][i - 1]}
                                        </motion.div>
                                    ))}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.5, duration: 0.3 }}
                                        className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium"
                                    >
                                        +99
                                    </motion.div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1, duration: 0.5 }}
                                    className="text-center"
                                >
                                    <p className="text-2xl font-bold text-secondary">500+</p>
                                    <p className="text-gray-600 text-sm">Customers</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2, duration: 0.5 }}
                                    className="text-center border-x border-gray-200"
                                >
                                    <p className="text-2xl font-bold text-primary">10K+</p>
                                    <p className="text-gray-600 text-sm">Users</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.3, duration: 0.5 }}
                                    className="text-center"
                                >
                                    <p className="text-2xl font-bold text-secondary">99.9%</p>
                                    <p className="text-gray-600 text-sm">Uptime</p>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
