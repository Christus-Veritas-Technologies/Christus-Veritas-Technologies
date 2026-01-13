"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/client-sidebar";
import { Separator } from "@/components/ui/separator";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/me`,
                    {
                        credentials: 'include',
                    }
                );

                if (!response.ok) {
                    router.push('/auth/signin');
                    return;
                }

                const userData = await response.json();

                // If user is admin, redirect to admin dashboard
                if (userData.isAdmin) {
                    router.push('/ultimate/dashboard');
                    return;
                }

                setUser(userData);
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/auth/signin');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">Loading your dashboard...</p>
                </motion.div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <SidebarProvider>
            <ClientSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Welcome back,
                        </span>
                        <span className="text-sm font-medium">
                            {user.firstName} {user.lastName}
                        </span>
                    </div>
                </header>
                <main className="flex-1 bg-gray-50/50">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
