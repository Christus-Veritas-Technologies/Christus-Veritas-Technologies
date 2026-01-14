"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/client-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, CreditCard, Package, Warning, CheckCircle, MagnifyingGlass, User } from "@phosphor-icons/react";
import Link from "next/link";

interface DashboardShellProps {
    children: React.ReactNode;
    userEmail: string;
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

export function DashboardShell({ children, userEmail }: DashboardShellProps) {
    const unreadCount = mockNotifications.filter(n => !n.read).length;

    // Get initials from email
    const initials = userEmail
        .split('@')[0]
        .split('.')
        .map(part => part[0]?.toUpperCase() || '')
        .join('')
        .slice(0, 2);

    return (
        <SidebarProvider>
            <ClientSidebar />
            <SidebarInset className="overflow-x-hidden bg-gray-50/30">
                <header className="flex h-16 shrink-0 items-center justify-between gap-4 px-6 bg-white border-b border-gray-100">
                    {/* Left side - Mobile trigger only */}
                    <div className="flex items-center gap-4 md:hidden">
                        <SidebarTrigger className="shrink-0" />
                    </div>

                    {/* Search bar - like in the design */}
                    <div className="hidden md:flex flex-1 max-w-md">
                        <div className="relative w-full">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search anything..."
                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white h-10 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Right side - Notifications & Avatar */}
                    <div className="flex items-center gap-3">
                        {/* Notifications Bell */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-lg hover:bg-gray-100">
                                    <Bell weight="regular" className="w-5 h-5 text-gray-600" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
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

                        {/* User Avatar */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20">
                                    <span className="text-sm font-medium text-primary">{initials}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2" align="end">
                                <div className="px-2 py-1.5 mb-2 border-b">
                                    <p className="text-sm font-medium truncate">{userEmail}</p>
                                </div>
                                <div className="space-y-1">
                                    <Button variant="ghost" className="w-full justify-start h-9 px-2" asChild>
                                        <Link href="/dashboard/account">
                                            <User weight="regular" className="w-4 h-4 mr-2" />
                                            Account Settings
                                        </Link>
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
