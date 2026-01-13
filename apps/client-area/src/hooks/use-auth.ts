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
    
    if (!authCookie) return null;
    
    // Use substring instead of split to handle = characters in JWT
    const trimmed = authCookie.trim();
    const token = trimmed.substring("auth_token=".length);
    
    return token || null;
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
        const checkAuth = () => {
            const token = getClientAuthToken();
            
            console.log("[useAuth] Token found:", !!token); // Debug log

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
                console.log("[useAuth] Decoded token:", decoded); // Debug log
                setAuthState({
                    isAuthenticated: true,
                    isLoading: false,
                    user: decoded,
                    token,
                });
            } catch (error) {
                console.error("[useAuth] Failed to decode token:", error);
                setAuthState({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                    token: null,
                });
            }
        };
        
        checkAuth();
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
        if (auth.isLoading) {
            console.log("[useProtectedRoute] Still loading...");
            return;
        }

        console.log("[useProtectedRoute] Auth state:", {
            isAuthenticated: auth.isAuthenticated,
            user: auth.user,
            token: auth.token ? "exists" : "null"
        });

        if (!auth.isAuthenticated) {
            console.log("[useProtectedRoute] Not authenticated, redirecting to signin");
            window.location.href = options?.redirectTo || "/auth/signin";
            return;
        }

        // Check email verification - only if emailVerified is explicitly false
        if (auth.user && auth.user.emailVerified === false) {
            console.log("[useProtectedRoute] Email not verified, redirecting to success");
            window.location.href = "/auth/success";
            return;
        }

        // If admin access required but user is not admin
        if (options?.requireAdmin && auth.user && !auth.user.isAdmin) {
            console.log("[useProtectedRoute] Admin required but user is not admin");
            window.location.href = "/dashboard";
            return;
        }

        // If user is admin and trying to access client dashboard
        if (!options?.requireAdmin && auth.user?.isAdmin) {
            console.log("[useProtectedRoute] User is admin, redirecting to admin dashboard");
            window.location.href = "/ultimate/dashboard";
            return;
        }
        
        console.log("[useProtectedRoute] All checks passed, user can access page");
    }, [auth.isLoading, auth.isAuthenticated, auth.user, options?.requireAdmin, options?.redirectTo]);

    return auth;
}
