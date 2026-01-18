"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    House,
    Users,
    UserList,
    Package,
    CurrencyDollar,
    EnvelopeSimple,
    SignOut,
    Gear,
    ChartLine,
    Storefront,
    CaretDown,
    HardDrives,
} from "@phosphor-icons/react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface User {
    email: string;
    name?: string | null;
}

interface UltimateShellProps {
    children: React.ReactNode;
    user: User;
}

// Overview section
const overviewItems = [
    {
        title: "Dashboard",
        url: "/ultimate/dashboard",
        icon: House,
    },
    {
        title: "Analytics",
        url: "/ultimate/financials",
        icon: ChartLine,
    },
];

// Management section
const managementItems = [
    {
        title: "Users",
        url: "/ultimate/users",
        icon: Users,
    },
    {
        title: "Clients",
        url: "/ultimate/clients",
        icon: UserList,
    },
    {
        title: "Services",
        url: "/ultimate/services",
        icon: Package,
    },
    {
        title: "Invitations",
        url: "/ultimate/invitations",
        icon: EnvelopeSimple,
    },
];

// System section
const systemItems = [
    {
        title: "Settings",
        url: "/ultimate/settings",
        icon: Gear,
    },
];

export function UltimateShell({ children, user }: UltimateShellProps) {
    const pathname = usePathname();

    const handleSignOut = () => {
        document.cookie = "auth_token=; path=/; max-age=0";
        document.cookie = "refresh_token=; path=/; max-age=0";
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/auth/signin";
    };

    const isActive = (url: string) => {
        if (url === "/ultimate/dashboard") {
            return pathname === "/ultimate/dashboard";
        }
        return pathname === url || pathname.startsWith(url + "/");
    };

    const NavItem = ({ item }: { item: { title: string; url: string; icon: any } }) => {
        const active = isActive(item.url);
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    className={cn(
                        "h-10 rounded-lg transition-all",
                        active
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                >
                    <Link href={item.url} className="flex items-center gap-3">
                        <item.icon
                            weight={active ? "fill" : "regular"}
                            className="w-5 h-5"
                        />
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return (
        <SidebarProvider>
            <Sidebar className="border-r-0">
                <SidebarHeader className="p-4">
                    <Link href="/ultimate/dashboard" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-lg font-bold text-gray-900">CVT Admin</span>
                            <p className="text-xs text-gray-500">Management Portal</p>
                        </div>
                    </Link>
                </SidebarHeader>

                <SidebarContent className="px-3">
                    {/* Overview Section */}
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                            Overview
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {overviewItems.map((item) => (
                                    <NavItem key={item.url} item={item} />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Management Section */}
                    <SidebarGroup className="mt-4">
                        <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                            Management
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {managementItems.map((item) => (
                                    <NavItem key={item.url} item={item} />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <div className="flex-1" />

                    {/* System Section */}
                    <SidebarGroup className="mt-auto">
                        <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                            System
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {systemItems.map((item) => (
                                    <NavItem key={item.url} item={item} />
                                ))}
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={handleSignOut}
                                        className="h-10 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
                                    >
                                        <SignOut weight="regular" className="w-5 h-5" />
                                        <span>Logout</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                                {user.name?.[0] || user.email[0].toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user.name || "Administrator"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset className="overflow-x-hidden bg-gray-50/30">
                <header className="flex h-14 items-center gap-4 border-b bg-white px-6">
                    <SidebarTrigger className="shrink-0" />
                    <div className="flex-1">
                        <nav className="flex items-center text-sm text-muted-foreground">
                            <Link href="/ultimate/dashboard" className="hover:text-foreground">
                                Admin
                            </Link>
                            {pathname !== "/ultimate/dashboard" && (
                                <>
                                    <span className="mx-2">/</span>
                                    <span className="text-foreground capitalize">
                                        {pathname.split("/").pop()?.replace(/-/g, " ")}
                                    </span>
                                </>
                            )}
                        </nav>
                    </div>
                    <Link
                        href="/dashboard"
                        className="text-sm text-gray-500 hover:text-primary transition-colors"
                    >
                        ← Back to Client Portal
                    </Link>
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
