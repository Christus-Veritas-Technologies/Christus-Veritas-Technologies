import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  // If not authenticated, redirect to signin
  if (!authToken) {
    redirect("/auth/signin");
  }

  // User is authenticated, show dashboard
  return <Dashboard />;
}
