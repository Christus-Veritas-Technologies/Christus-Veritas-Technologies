"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SignupSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card>
                    <CardHeader className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <svg
                                className="w-10 h-10 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </motion.div>
                        <CardTitle className="text-2xl">Check Your Email</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Verify your email to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <p className="text-muted-foreground">
                                We've sent a verification link to your email address.
                                Please check your inbox and click the link to activate your account.
                            </p>

                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    <strong className="text-foreground">Didn't receive the email?</strong>
                                    <br />
                                    Check your spam folder or request a new verification link.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        // Get email from session/localStorage if stored
                                        const storedEmail = localStorage.getItem('pendingVerificationEmail');
                                        if (storedEmail) {
                                            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/resend-verification`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ email: storedEmail }),
                                            })
                                                .then(() => alert('Verification email resent!'))
                                                .catch(() => alert('Failed to resend email. Please try again.'));
                                        } else {
                                            window.location.href = '/auth/signin';
                                        }
                                    }}
                                >
                                    Resend Verification Email
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => window.location.href = '/auth/signin'}
                                >
                                    Back to Sign In
                                </Button>
                            </div>
                        </motion.div>
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
