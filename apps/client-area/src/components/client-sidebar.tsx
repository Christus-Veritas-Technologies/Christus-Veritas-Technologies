"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    House,
    Receipt,
    CreditCard,
    Package,
    Key,
    SignOut,
    Storefront,
    Briefcase,
    Gear,
    CaretDown,
    HardDrives,
} from "@phosphor-icons/react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainNavItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: House,
    },
    {
        title: "Projects",
        url: "/dashboard/projects",
        icon: Briefcase,
    },
    {
        title: "Invoices",
        url: "/dashboard/billing",
        icon: Receipt,
    },
    {
        title: "Payments",
        url: "/dashboard/payments",
        icon: CreditCard,
    },
    {
        title: "Services",
        url: "/dashboard/services",
        icon: Package,
    },
    {
        title: "Marketplace",
        url: "/dashboard/marketplace",
        icon: Storefront,
    },
    {
        title: "API Keys",
        url: "/dashboard/api-keys",
        icon: Key,
    },
];

const bottomNavItems = [
    {
        title: "Settings",
        url: "/dashboard/account",
        icon: Gear,
    },
];

export function ClientSidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            // Clear cookies
            document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = '/auth/signin';
        } catch (error) {
            console.error('Logout failed:', error);
            window.location.href = '/auth/signin';
        }
    };

    // Mock usage data - replace with real data
    const storageUsed = 42;
    const storageTotal = 256;
    const usagePercent = (storageUsed / storageTotal) * 100;

    return (
        <Sidebar className="border-r-0">
            <SidebarHeader className="p-4">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold text-gray-900">CVT Portal</span>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-3">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => {
                                const isActive = pathname === item.url ||
                                    (item.url !== "/dashboard" && pathname.startsWith(item.url));
                                const isExactDashboard = item.url === "/dashboard" && pathname === "/dashboard";
                                const active = isExactDashboard || (item.url !== "/dashboard" && isActive);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "h-10 rounded-lg transition-all",
                                                active
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            )}
                                        >
                                            <Link href={item.url} className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-3">
                                                    <item.icon
                                                        weight={active ? "fill" : "regular"}
                                                        className="w-5 h-5"
                                                    />
                                                    <span>{item.title}</span>
                                                </div>
                                                {item.url === "/dashboard" && active && (
                                                    <CaretDown weight="bold" className="w-4 h-4" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className="flex-1" />

                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {bottomNavItems.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(item.url + "/");

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "h-10 rounded-lg transition-all",
                                                isActive
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            )}
                                        >
                                            <Link href={item.url}>
                                                <item.icon weight={isActive ? "fill" : "regular"} className="w-5 h-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={handleLogout}
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
                {/* Usage indicator like in the design */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <HardDrives weight="regular" className="w-5 h-5" />
                        <span className="text-sm font-medium">Usage</span>
                        <CaretDown weight="bold" className="w-4 h-4 ml-auto" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${usagePercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            ${storageUsed} used from ${storageTotal} budget
                        </p>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
