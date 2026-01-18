"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Users,
    CurrencyDollar,
    ShoppingCart,
    CreditCard,
    TrendUp,
    TrendDown,
    ArrowRight,
    Package,
    Briefcase,
    Clock,
    CheckCircle,
    Warning,
} from "@phosphor-icons/react";
import Link from "next/link";
import { apiClientWithAuth } from "@/lib/api-client";

interface DashboardStats {
    users: {
        total: number;
        thisMonth: number;
        growth: number;
    };
    orders: {
        total: number;
        thisMonth: number;
        growth: number;
    };
    payments: {
        total: number;
        thisMonth: number;
        growth: number;
    };
    revenue: {
        total: number;
        thisMonth: number;
        growth: number;
    };
    services: {
        active: number;
    };
    projects: {
        total: number;
        pending: number;
    };
}

interface Activity {
    type: "user" | "payment" | "order" | "project";
    id: string;
    description: string;
    date: string;
    metadata?: any;
}

function StatCard({
    title,
    value,
    subtitle,
    growth,
    icon: Icon,
    iconBg,
    href,
}: {
    title: string;
    value: string | number;
    subtitle: string;
    growth?: number;
    icon: React.ElementType;
    iconBg: string;
    href?: string;
}) {
    const content = (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold">{value}</p>
                        <div className="flex items-center gap-2">
                            {growth !== undefined && (
                                <span
                                    className={`flex items-center text-xs font-medium ${growth >= 0 ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {growth >= 0 ? (
                                        <TrendUp className="w-3 h-3 mr-1" />
                                    ) : (
                                        <TrendDown className="w-3 h-3 mr-1" />
                                    )}
                                    {Math.abs(growth)}%
                                </span>
                            )}
                            <span className="text-xs text-muted-foreground">{subtitle}</span>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl ${iconBg}`}>
                        <Icon weight="duotone" className="w-6 h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }
    return content;
}

function ActivityItem({ activity }: { activity: Activity }) {
    const getIcon = () => {
        switch (activity.type) {
            case "user":
                return <Users className="w-4 h-4 text-blue-600" />;
            case "payment":
                return <CreditCard className="w-4 h-4 text-green-600" />;
            case "order":
                return <ShoppingCart className="w-4 h-4 text-purple-600" />;
            case "project":
                return <Briefcase className="w-4 h-4 text-orange-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const getBg = () => {
        switch (activity.type) {
            case "user":
                return "bg-blue-100";
            case "payment":
                return "bg-green-100";
            case "order":
                return "bg-purple-100";
            case "project":
                return "bg-orange-100";
            default:
                return "bg-gray-100";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getBg()}`}>
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 line-clamp-2">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(activity.date)}</p>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activity, setActivity] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    apiClientWithAuth<DashboardStats>("/admin/dashboard"),
                    apiClientWithAuth<Activity[]>("/admin/dashboard/activity?limit=10"),
                ]);

                if (!statsRes.ok || !statsRes.data || !activityRes.ok || !activityRes.data) {
                    throw new Error(statsRes.error || activityRes.error || "Failed to fetch dashboard data");
                }

                setStats(statsRes.data);
                setActivity(activityRes.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your platform</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-8 w-32 mb-2" />
                                <Skeleton className="h-3 w-20" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <Warning className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold mb-2">Error Loading Dashboard</h2>
                        <p className="text-muted-foreground">{error}</p>
                        <Button className="mt-4" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Overview of your platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.revenue.total.toLocaleString() || 0}`}
                    subtitle="this month"
                    growth={stats?.revenue.growth}
                    icon={CurrencyDollar}
                    iconBg="bg-green-500"
                    href="/admin/payments"
                />
                <StatCard
                    title="Total Users"
                    value={stats?.users.total || 0}
                    subtitle={`+${stats?.users.thisMonth || 0} this month`}
                    growth={stats?.users.growth}
                    icon={Users}
                    iconBg="bg-blue-500"
                    href="/admin/users"
                />
                <StatCard
                    title="Total Orders"
                    value={stats?.orders.total || 0}
                    subtitle={`+${stats?.orders.thisMonth || 0} this month`}
                    growth={stats?.orders.growth}
                    icon={ShoppingCart}
                    iconBg="bg-purple-500"
                    href="/admin/orders"
                />
                <StatCard
                    title="Payments"
                    value={stats?.payments.total || 0}
                    subtitle={`+${stats?.payments.thisMonth || 0} this month`}
                    growth={stats?.payments.growth}
                    icon={CreditCard}
                    iconBg="bg-orange-500"
                    href="/admin/payments"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            Active Services
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats?.services.active || 0}</p>
                        <Link
                            href="/admin/services"
                            className="text-sm text-primary flex items-center gap-1 mt-2 hover:underline"
                        >
                            Manage services <ArrowRight className="w-4 h-4" />
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" />
                            Projects
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats?.projects.total || 0}</p>
                        <div className="flex items-center gap-2 mt-2">
                            {(stats?.projects.pending || 0) > 0 && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                    {stats?.projects.pending} pending
                                </span>
                            )}
                            <Link
                                href="/admin/projects"
                                className="text-sm text-primary flex items-center gap-1 hover:underline"
                            >
                                View all <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <CurrencyDollar className="w-4 h-4 text-green-600" />
                            Monthly Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            ${stats?.revenue.thisMonth.toLocaleString() || 0}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            {stats?.revenue.growth !== undefined && stats.revenue.growth >= 0 ? (
                                <span className="text-green-600">↑ {stats.revenue.growth}%</span>
                            ) : (
                                <span className="text-red-600">↓ {Math.abs(stats?.revenue.growth || 0)}%</span>
                            )}{" "}
                            from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity and Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest actions on your platform</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {activity.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                No recent activity
                            </div>
                        ) : (
                            <div className="divide-y">
                                {activity.map((item) => (
                                    <ActivityItem key={`${item.type}-${item.id}`} activity={item} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/admin/services">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Package className="w-4 h-4" />
                                Create New Service
                            </Button>
                        </Link>
                        <Link href="/admin/users">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Users className="w-4 h-4" />
                                View All Users
                            </Button>
                        </Link>
                        <Link href="/admin/projects">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Briefcase className="w-4 h-4" />
                                Review Pending Projects
                            </Button>
                        </Link>
                        <Link href="/admin/payments">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <CreditCard className="w-4 h-4" />
                                View Payment History
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
