"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
    ChartLine,
    Users,
    Package,
    Briefcase,
    CreditCard,
    Receipt,
    Gear,
    SignOut,
    House,
    ShoppingCart,
    CaretRight,
} from "@phosphor-icons/react";
import Image from "next/image";

interface AdminDashboardShellProps {
    children: React.ReactNode;
    userEmail: string;
    token: string;
}

const menuItems = [
    {
        title: "Dashboard",
        icon: ChartLine,
        href: "/admin",
    },
    {
        title: "Users",
        icon: Users,
        href: "/admin/users",
    },
    {
        title: "Services",
        icon: Package,
        href: "/admin/services",
    },
    {
        title: "Projects",
        icon: Briefcase,
        href: "/admin/projects",
    },
    {
        title: "Payments",
        icon: CreditCard,
        href: "/admin/payments",
    },
    {
        title: "Orders",
        icon: ShoppingCart,
        href: "/admin/orders",
    },
];

export function AdminDashboardShell({ children, userEmail, token }: AdminDashboardShellProps) {
    const pathname = usePathname();

    const handleSignOut = async () => {
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/auth/signin";
    };

    return (
        <SidebarProvider>
            <Sidebar className="border-r bg-white">
                <SidebarHeader className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">CV</span>
                        </div>
                        <div>
                            <h2 className="font-semibold text-sm">CVT Admin</h2>
                            <p className="text-xs text-muted-foreground">Management Portal</p>
                        </div>
                    </div>
                </SidebarHeader>

                <SidebarContent className="p-2">
                    <SidebarGroup>
                        <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={
                                                item.href === "/admin"
                                                    ? pathname === "/admin"
                                                    : pathname.startsWith(item.href)
                                            }
                                        >
                                            <Link href={item.href}>
                                                <item.icon weight="duotone" className="w-5 h-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/dashboard">
                                            <House weight="duotone" className="w-5 h-5" />
                                            <span>Client Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users weight="fill" className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{userEmail}</p>
                            <p className="text-xs text-muted-foreground">Administrator</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleSignOut}
                    >
                        <SignOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="flex h-14 items-center gap-4 border-b bg-white px-6">
                    <SidebarTrigger />
                    <div className="flex-1">
                        <nav className="flex items-center text-sm text-muted-foreground">
                            <Link href="/admin" className="hover:text-foreground">
                                Admin
                            </Link>
                            {pathname !== "/admin" && (
                                <>
                                    <CaretRight className="w-4 h-4 mx-1" />
                                    <span className="text-foreground capitalize">
                                        {pathname.split("/").pop()?.replace(/-/g, " ")}
                                    </span>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flex-1 p-6 bg-gray-50">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
