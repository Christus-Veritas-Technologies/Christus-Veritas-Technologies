import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard-content";

export default async function ClientDashboardPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");

    // If not authenticated, redirect to signin
    if (!authToken?.value) {
        redirect("/auth/signin");
    }

    return <DashboardContent token={authToken.value} />;
}
