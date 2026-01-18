"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Area,
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import {
    Users,
    Package,
    CurrencyDollar,
    TrendUp,
    TrendDown,
    MagnifyingGlass,
    Export,
    Eye,
    DotsThree,
    Calendar,
    Briefcase,
    ChartLine,
    ArrowRight,
} from "@phosphor-icons/react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = `${API_BASE}/api`;

interface DashboardStats {
    users: {
        total: number;
        clients: number;
        admins: number;
        growth: number;
    };
    orders: {
        total: number;
        pending: number;
        completed: number;
        growth: number;
    };
    payments: {
        total: number;
        pending: number;
        completed: number;
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

interface RevenueData {
    chartData: Array<{ date: string; amount: number; count: number }>;
    methodBreakdown: Record<string, number>;
    total: number;
    thisMonth: number;
}

interface User {
    id: string;
    name: string | null;
    email: string;
    businessName: string | null;
    isAdmin: boolean;
    createdAt: string;
}

interface Activity {
    id: string;
    type: string;
    message: string;
    timestamp: string;
}

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(var(--primary))",
    },
    orders: {
        label: "Orders",
        color: "hsl(var(--secondary))",
    },
} satisfies ChartConfig;

const COLORS = ["#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

export default function UltimateDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [activity, setActivity] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const getToken = () => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];
    };

    const fetchDashboardData = async () => {
        try {
            const token = getToken();
            const headers = { Authorization: `Bearer ${token}` };

            const [statsRes, revenueRes, usersRes, activityRes] = await Promise.all([
                fetch(`${API_URL}/admin/dashboard`, { headers }),
                fetch(`${API_URL}/admin/analytics/revenue?period=year`, { headers }),
                fetch(`${API_URL}/admin/users?limit=5`, { headers }),
                fetch(`${API_URL}/admin/dashboard/activity?limit=5`, { headers }),
            ]);

            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }
            if (revenueRes.ok) {
                const data = await revenueRes.json();
                setRevenueData(data);
            }
            if (usersRes.ok) {
                const data = await usersRes.json();
                setUsers(data.users || []);
            }
            if (activityRes.ok) {
                const data = await activityRes.json();
                setActivity(data || []);
            }
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-80" />
                    <Skeleton className="h-80" />
                </div>
            </div>
        );
    }

    // Prepare chart data
    const monthlyRevenueData = revenueData?.chartData?.map((item) => ({
        month: new Date(item.date).toLocaleDateString("en-US", { month: "short" }),
        revenue: item.amount,
        orders: item.count,
    })) || [];

    // Service/category breakdown for horizontal bar chart
    const serviceBreakdown = Object.entries(revenueData?.methodBreakdown || {}).map(([name, value]) => ({
        name,
        value,
        percentage: revenueData ? Math.round((value / revenueData.total) * 100) : 0,
    }));

    return (
        <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{getGreeting()}, Admin</h1>
                    <p className="text-gray-500 mt-1">
                        Here&apos;s what&apos;s happening with your business today
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                            {new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <Link href="/ultimate/services/new">
                        <Button variant="outline" className="gap-2">
                            <Package className="w-4 h-4" />
                            New Service
                        </Button>
                    </Link>
                    <Link href="/ultimate/invitations">
                        <Button className="gap-2">
                            <Users className="w-4 h-4" />
                            Invite User
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {stats?.users.total || 0}
                                    </span>
                                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                        +{stats?.users.clients || 0}
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {stats?.users.admins || 0} admins
                                </p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Users weight="duotone" className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4 text-sm">
                            {(stats?.users.growth || 0) >= 0 ? (
                                <>
                                    <TrendUp className="w-4 h-4 text-green-500" />
                                    <span className="text-green-500 font-medium">+{stats?.users.growth}%</span>
                                </>
                            ) : (
                                <>
                                    <TrendDown className="w-4 h-4 text-red-500" />
                                    <span className="text-red-500 font-medium">{stats?.users.growth}%</span>
                                </>
                            )}
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Services */}
                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Services</p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {stats?.services.active || 0}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Products offered</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Package weight="duotone" className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: "75%" }}
                                />
                            </div>
                            <span className="text-xs text-gray-500">75% active</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Revenue */}
                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatCurrency(stats?.revenue.total || 0)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">All time earnings</p>
                            </div>
                            <div className="p-3 bg-secondary/10 rounded-xl">
                                <CurrencyDollar weight="duotone" className="w-6 h-6 text-secondary" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4 text-sm">
                            {(stats?.revenue.growth || 0) >= 0 ? (
                                <>
                                    <TrendUp className="w-4 h-4 text-green-500" />
                                    <span className="text-green-500 font-medium">+{stats?.revenue.growth}%</span>
                                </>
                            ) : (
                                <>
                                    <TrendDown className="w-4 h-4 text-red-500" />
                                    <span className="text-red-500 font-medium">{stats?.revenue.growth}%</span>
                                </>
                            )}
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Projects */}
                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Projects</p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {stats?.projects.total || 0}
                                    </span>
                                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-600">
                                        {stats?.projects.pending || 0} pending
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Awaiting action</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <Briefcase weight="duotone" className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <Link
                            href="/ultimate/projects"
                            className="flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
                        >
                            View all projects
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Method (Horizontal Bar) */}
                <Card className="bg-white border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold">Payment Methods</CardTitle>
                                <CardDescription>Revenue breakdown by payment method</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon">
                                <DotsThree className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {serviceBreakdown.length > 0 ? (
                                serviceBreakdown.map((item, index) => (
                                    <div key={item.name} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-gray-700">{item.name}</span>
                                            <span className="text-gray-500">{formatCurrency(item.value)}</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${item.percentage}%`,
                                                    backgroundColor: COLORS[index % COLORS.length],
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No payment data available
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Revenue Chart */}
                <Card className="bg-white border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold">Revenue Statistics</CardTitle>
                                <CardDescription>Monthly revenue and order trends</CardDescription>
                            </div>
                            <Select defaultValue="year">
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {monthlyRevenueData.length > 0 ? (
                            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <AreaChart data={monthlyRevenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#9ca3af" }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#9ca3af" }}
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        ) : (
                            <div className="h-[250px] flex items-center justify-center text-gray-500">
                                No revenue data available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="bg-white border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link
                            href="/ultimate/invitations"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users weight="duotone" className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Invite User</p>
                                <p className="text-xs text-gray-500">Add new client or admin</p>
                            </div>
                        </Link>
                        <Link
                            href="/ultimate/services"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <Package weight="duotone" className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Create Service</p>
                                <p className="text-xs text-gray-500">Add new product offering</p>
                            </div>
                        </Link>
                        <Link
                            href="/ultimate/financials"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <ChartLine weight="duotone" className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">View Reports</p>
                                <p className="text-xs text-gray-500">Financial analytics</p>
                            </div>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Users */}
                <Card className="bg-white border-0 shadow-sm lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">Recent Users</CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search..."
                                        className="pl-9 w-48"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Link href="/ultimate/users">
                                    <Button variant="outline" size="sm">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-medium">User</TableHead>
                                    <TableHead className="font-medium">Email</TableHead>
                                    <TableHead className="font-medium">Role</TableHead>
                                    <TableHead className="font-medium text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length > 0 ? (
                                    users
                                        .filter(
                                            (user) =>
                                                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                user.email.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((user) => (
                                            <TableRow key={user.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <span className="text-primary text-sm font-medium">
                                                                {(user.name || user.email)[0].toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {user.name || "Unnamed"}
                                                            </p>
                                                            {user.businessName && (
                                                                <p className="text-xs text-gray-500">
                                                                    {user.businessName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={user.isAdmin ? "default" : "secondary"}
                                                        className={
                                                            user.isAdmin
                                                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                                                : "bg-gray-100 text-gray-600"
                                                        }
                                                    >
                                                        {user.isAdmin ? "Admin" : "Client"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/ultimate/users?id=${user.id}`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                        <Button variant="ghost" size="sm" className="text-primary">
                            View All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activity.length > 0 ? (
                            activity.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div
                                        className={`w-2 h-2 mt-2 rounded-full ${item.type === "user"
                                                ? "bg-primary"
                                                : item.type === "payment"
                                                    ? "bg-green-500"
                                                    : item.type === "order"
                                                        ? "bg-secondary"
                                                        : "bg-orange-500"
                                            }`}
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900">{item.message}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">No recent activity</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
