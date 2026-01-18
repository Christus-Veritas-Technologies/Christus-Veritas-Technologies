"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export default function GoogleCallbackPage() {
    useEffect(() => {
        // Get tokens from URL
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const isAdmin = params.get("is_admin") === "true";

        if (!accessToken || !refreshToken) {
            window.location.href = "/auth/signin?error=authentication_failed";
            return;
        }

        // Set cookies on the client side
        document.cookie = `auth_token=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;

        // Check if user has completed onboarding
        const checkOnboarding = async () => {
            try {
                const response = await apiClient<{ onboardingCompleted: boolean }>("/auth/me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.ok && response.data) {
                    if (isAdmin) {
                        window.location.href = "/ultimate/dashboard";
                    } else if (!response.data.onboardingCompleted) {
                        window.location.href = "/onboarding";
                    } else {
                        window.location.href = "/dashboard";
                    }
                } else {
                    // Fallback to dashboard
                    window.location.href = isAdmin ? "/ultimate/dashboard" : "/dashboard";
                }
            } catch {
                // Fallback to dashboard on error
                window.location.href = isAdmin ? "/ultimate/dashboard" : "/dashboard";
            }
        };

        // Small delay to ensure cookies are set before checking
        setTimeout(checkOnboarding, 100);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Completing sign in...</p>
            </div>
        </div>
    );
}
