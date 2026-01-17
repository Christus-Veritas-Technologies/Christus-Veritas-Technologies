import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";

interface JwtPayload {
    sub: string;
    email: string;
    isAdmin: boolean;
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

    if (!authToken?.value) {
        redirect("/auth/signin");
    }

    let user: JwtPayload;
    try {
        user = jwtDecode<JwtPayload>(authToken.value);

        // Check if token is expired
        const now = Math.floor(Date.now() / 1000);
        if (user.exp < now) {
            redirect("/auth/signin");
        }

        // Check if user is admin
        if (!user.isAdmin) {
            redirect("/dashboard");
        }
    } catch (error) {
        redirect("/auth/signin");
    }

    return (
        <AdminDashboardShell userEmail={user.email} token={authToken.value}>
            {children}
        </AdminDashboardShell>
    );
}
