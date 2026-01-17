import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";

interface JwtPayload {
    sub: string;
    userId: string;
    email: string;
    isAdmin: boolean;
    emailVerified: boolean;
    exp: number;
    iat: number;
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");

    console.log("[AdminLayout] Auth token exists:", !!authToken?.value);

    if (!authToken?.value) {
        console.log("[AdminLayout] No auth token, redirecting to signin");
        redirect("/auth/signin");
    }

    let user: JwtPayload;
    try {
        user = jwtDecode<JwtPayload>(authToken.value);
    } catch (error) {
        console.log("[AdminLayout] Error decoding token:", error);
        redirect("/auth/signin");
    }

    console.log("[AdminLayout] Full decoded token:", JSON.stringify(user, null, 2));
    console.log("[AdminLayout] Decoded user:", user.email, "isAdmin:", user.isAdmin);

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (user.exp < now) {
        console.log("[AdminLayout] Token expired, redirecting to signin");
        redirect("/auth/signin");
    }

    // Check if user is admin
    if (!user.isAdmin) {
        console.log("[AdminLayout] User is not admin, redirecting to dashboard");
        redirect("/dashboard");
    }

    return (
        <AdminDashboardShell userEmail={user.email} token={authToken.value}>
            {children}
        </AdminDashboardShell>
    );
}
