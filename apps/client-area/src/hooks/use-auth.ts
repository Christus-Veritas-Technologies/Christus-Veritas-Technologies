"use client";

import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    userId: string;
    email: string;
    isAdmin: boolean;
    emailVerified: boolean;
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: TokenPayload | null;
    token: string | null;
}

/**
 * Get auth token from cookies (client-side)
 */
export function getClientAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    
    const cookies = document.cookie.split(";");
    const authCookie = cookies.find((c) => c.trim().startsWith("auth_token="));
    return authCookie?.split("=")[1] || null;
}

/**
 * Client-side hook for authentication state
 * Use this in client components that need auth info
 */
export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        token: null,
    });

    useEffect(() => {
        const token = getClientAuthToken();

        if (!token) {
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                token: null,
            });
            return;
        }

        try {
            const decoded = jwtDecode<TokenPayload>(token);
            setAuthState({
                isAuthenticated: true,
                isLoading: false,
                user: decoded,
                token,
            });
        } catch {
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                token: null,
            });
        }
    }, []);

    const signOut = useCallback(() => {
        document.cookie = "auth_token=; path=/; max-age=0";
        document.cookie = "refresh_token=; path=/; max-age=0";
        window.location.href = "/auth/signin";
    }, []);

    return {
        ...authState,
        signOut,
    };
}

/**
 * Client-side route protection hook
 * Redirects to signin if not authenticated
 */
export function useProtectedRoute(options?: {
    requireAdmin?: boolean;
    redirectTo?: string;
}) {
    const auth = useAuth();

    useEffect(() => {
        if (auth.isLoading) return;

        if (!auth.isAuthenticated) {
            window.location.href = options?.redirectTo || "/auth/signin";
            return;
        }

        // Check email verification
        if (auth.user && !auth.user.emailVerified) {
            window.location.href = "/auth/success";
            return;
        }

        // If admin access required but user is not admin
        if (options?.requireAdmin && auth.user && !auth.user.isAdmin) {
            window.location.href = "/dashboard";
            return;
        }

        // If user is admin and trying to access client dashboard
        if (!options?.requireAdmin && auth.user?.isAdmin) {
            window.location.href = "/ultimate/dashboard";
            return;
        }
    }, [auth.isLoading, auth.isAuthenticated, auth.user, options?.requireAdmin, options?.redirectTo]);

    return auth;
}
