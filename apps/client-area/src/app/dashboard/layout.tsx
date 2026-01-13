"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/client-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, CreditCard, Package, Warning, CheckCircle } from "@phosphor-icons/react";
import Link from "next/link";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
}

interface Notification {
    id: string;
    type: "payment" | "service" | "warning" | "success";
    title: string;
    message: string;
    date: string;
    read: boolean;
}

// Mock notifications - replace with real API calls
const mockNotifications: Notification[] = [
    { id: "1", type: "warning", title: "Invoice Overdue", message: "Invoice #INV-001 is overdue by 3 days", date: "2 hours ago", read: false },
    { id: "2", type: "payment", title: "Payment Received", message: "Payment of $299.99 received successfully", date: "1 day ago", read: false },
    { id: "3", type: "service", title: "Service Renewed", message: "Your POS System subscription was renewed", date: "2 days ago", read: true },
    { id: "4", type: "success", title: "API Key Created", message: "New API key 'Production' was generated", date: "3 days ago", read: true },
    { id: "5", type: "service", title: "Maintenance Scheduled", message: "System maintenance on Jan 20, 2026", date: "5 days ago", read: true },
];

const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
        case "payment":
            return <CreditCard weight="fill" className="w-4 h-4 text-green-600" />;
        case "service":
            return <Package weight="fill" className="w-4 h-4 text-primary" />;
        case "warning":
            return <Warning weight="fill" className="w-4 h-4 text-amber-600" />;
        case "success":
            return <CheckCircle weight="fill" className="w-4 h-4 text-green-600" />;
    }
};

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
                // Get auth token from cookie
                const cookies = document.cookie.split(';');
                const authCookie = cookies.find(c => c.trim().startsWith('auth_token='));
                const token = authCookie?.split('=')[1];

                if (!token) {
                    window.location.href = '/auth/signin';
                    return;
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    window.location.href = '/auth/signin';
                    return;
                }

                const userData = await response.json();

                // If user is admin, redirect to admin dashboard
                if (userData.isAdmin) {
                    window.location.href = '/ultimate/dashboard';
                    return;
                }

                setUser(userData);
            } catch (error) {
                console.error('Auth check failed:', error);
                window.location.href = '/auth/signin';
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

    const unreadCount = mockNotifications.filter(n => !n.read).length;

    return (
        <SidebarProvider>
            <ClientSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-white">
                    <div className="flex items-center gap-2">
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
                    </div>

                    {/* Notifications Bell */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell weight="regular" className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="end">
                            <div className="p-4 border-b">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">Notifications</h4>
                                    {unreadCount > 0 && (
                                        <span className="text-xs text-muted-foreground">
                                            {unreadCount} unread
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {mockNotifications.slice(0, 5).map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b last:border-0 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-primary/5" : ""
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notification.type === "warning" ? "bg-amber-100" :
                                                notification.type === "payment" ? "bg-green-100" :
                                                    notification.type === "success" ? "bg-green-100" :
                                                        "bg-primary/10"
                                                }`}>
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {notification.date}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t">
                                <Button variant="ghost" className="w-full text-sm" asChild>
                                    <Link href="/dashboard/notifications">
                                        View all notifications
                                    </Link>
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </header>
                <main className="flex-1 bg-gray-50/50">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
