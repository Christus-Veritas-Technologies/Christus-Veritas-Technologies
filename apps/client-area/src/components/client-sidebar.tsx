"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    House,
    Receipt,
    CreditCard,
    Package,
    Key,
    User,
    SignOut,
} from "@phosphor-icons/react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainNavItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: House,
    },
    {
        title: "Billing & Invoices",
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
        title: "API Keys",
        url: "/dashboard/api-keys",
        icon: Key,
    },
];

const settingsNavItems = [
    {
        title: "Account",
        url: "/dashboard/account",
        icon: User,
    },
];

export function ClientSidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            window.location.href = '/auth/signin';
        } catch (error) {
            console.error('Logout failed:', error);
            window.location.href = '/auth/signin';
        }
    };

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-3 px-4 py-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-sidebar-foreground">CVT</span>
                        <span className="text-xs text-sidebar-foreground/60">Client Portal</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
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
                                                "transition-colors",
                                                active && "bg-primary text-white hover:bg-primary/90 hover:text-white"
                                            )}
                                        >
                                            <Link href={item.url}>
                                                <item.icon weight={active ? "fill" : "regular"} className="w-5 h-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsNavItems.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(item.url + "/");

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "transition-colors",
                                                isActive && "bg-primary text-white hover:bg-primary/90 hover:text-white"
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
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <SignOut weight="regular" className="w-5 h-5" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
