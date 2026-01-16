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
import {
    Bell,
    CreditCard,
    Package,
    Warning,
    CheckCircle,
    MagnifyingGlass,
    User,
    Info,
    Receipt,
    Briefcase,
    Gear,
    Checks,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, type Notification } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardShellProps {
    children: React.ReactNode;
    userEmail: string;
}

const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case "payment":
            return <CreditCard weight="fill" className="w-4 h-4 text-green-600" />;
        case "invoice":
            return <Receipt weight="fill" className="w-4 h-4 text-blue-600" />;
        case "project":
            return <Briefcase weight="fill" className="w-4 h-4 text-purple-600" />;
        case "service":
            return <Package weight="fill" className="w-4 h-4 text-primary" />;
        case "warning":
        case "error":
            return <Warning weight="fill" className="w-4 h-4 text-amber-600" />;
        case "success":
            return <CheckCircle weight="fill" className="w-4 h-4 text-green-600" />;
        case "system":
            return <Gear weight="fill" className="w-4 h-4 text-gray-600" />;
        default:
            return <Info weight="fill" className="w-4 h-4 text-blue-600" />;
    }
};

const getNotificationBgColor = (type: string) => {
    switch (type.toLowerCase()) {
        case "payment":
        case "success":
            return "bg-green-100";
        case "invoice":
            return "bg-blue-100";
        case "project":
            return "bg-purple-100";
        case "service":
            return "bg-primary/10";
        case "warning":
        case "error":
            return "bg-amber-100";
        case "system":
            return "bg-gray-100";
        default:
            return "bg-blue-100";
    }
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
};

function NotificationItem({
    notification,
    onMarkRead
}: {
    notification: Notification;
    onMarkRead: (id: string) => void;
}) {
    return (
        <div
            className={`p-4 border-b last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? "bg-primary/5" : ""
                }`}
            onClick={() => !notification.read && onMarkRead(notification.id)}
        >
            <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getNotificationBgColor(notification.type)
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
                        {formatTimeAgo(notification.createdAt)}
                    </p>
                </div>
                {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                )}
            </div>
        </div>
    );
}

function NotificationsPopover() {
    const { data: notifications, isLoading } = useNotifications();
    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();

    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    const handleMarkRead = (id: string) => {
        markRead.mutate(id);
    };

    const handleMarkAllRead = () => {
        markAllRead.mutate();
    };

    return (
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
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <>
                                    <span className="text-xs text-muted-foreground">
                                        {unreadCount} unread
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-xs"
                                        onClick={handleMarkAllRead}
                                        disabled={markAllRead.isPending}
                                    >
                                        <Checks className="w-3 h-3 mr-1" />
                                        Mark all
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications && notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkRead={handleMarkRead}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <Bell weight="light" className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                                No notifications yet
                            </p>
                        </div>
                    )}
                </div>
                {notifications && notifications.length > 0 && (
                    <div className="p-3 border-t">
                        <Button variant="ghost" className="w-full text-sm" asChild>
                            <Link href="/dashboard/notifications">
                                View all notifications
                            </Link>
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}

export function DashboardShell({ children, userEmail }: DashboardShellProps) {
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
                        <NotificationsPopover />

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
