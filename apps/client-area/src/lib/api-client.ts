/**
 * Central API Client
 * 
 * This is the SINGLE source of truth for all backend API calls.
 * All API requests (server components, client components, API routes, 
 * server actions, TanStack Query) should use this function.
 */

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiClientOptions {
    method?: RequestMethod;
    body?: unknown;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
}

interface NextFetchRequestConfig {
    revalidate?: number | false;
    tags?: string[];
}

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
    ok: boolean;
}

// Build the API base URL - always append /api to the base URL
const getApiBaseUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return `${baseUrl}/api`;
};

/**
 * Makes an API request to the backend server.
 * 
 * @param endpoint - The API endpoint (e.g., "/admin/users", "/auth/me")
 * @param options - Request options
 * @returns ApiResponse with data or error
 * 
 * @example
 * // GET request
 * const { data, error } = await apiClient<User[]>("/admin/users");
 * 
 * @example
 * // POST request
 * const { data, error } = await apiClient<User>("/admin/users", {
 *   method: "POST",
 *   body: { email: "user@example.com", name: "John" }
 * });
 * 
 * @example
 * // With auth token (client-side)
 * const { data, error } = await apiClient<DashboardStats>("/admin/dashboard", {
 *   headers: { Authorization: `Bearer ${token}` }
 * });
 */
export async function apiClient<T = unknown>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
    const {
        method = "GET",
        body,
        headers = {},
        credentials = "include",
        cache,
        next,
    } = options;

    const url = `${getApiBaseUrl()}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
    };

    const fetchOptions: RequestInit = {
        method,
        headers: requestHeaders,
        credentials,
    };

    if (body && method !== "GET") {
        fetchOptions.body = JSON.stringify(body);
    }

    if (cache) {
        fetchOptions.cache = cache;
    }

    if (next) {
        (fetchOptions as any).next = next;
    }

    try {
        const response = await fetch(url, fetchOptions);

        let data: T | null = null;
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
            try {
                data = await response.json();
            } catch {
                // Response body might be empty
                data = null;
            }
        }

        if (!response.ok) {
            const errorMessage = 
                (data as any)?.message || 
                (data as any)?.error || 
                `Request failed with status ${response.status}`;
            
            return {
                data: null,
                error: errorMessage,
                status: response.status,
                ok: false,
            };
        }

        return {
            data,
            error: null,
            status: response.status,
            ok: true,
        };
    } catch (error) {
        console.error(`[API Client Error] ${method} ${url}:`, error);
        
        return {
            data: null,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
            status: 0,
            ok: false,
        };
    }
}

/**
 * Helper to get auth token from cookies (client-side only)
 */
export function getAuthToken(): string | undefined {
    if (typeof document === "undefined") return undefined;
    
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];
}

/**
 * Creates headers with authorization token
 */
export function createAuthHeaders(token?: string): Record<string, string> {
    const authToken = token || getAuthToken();
    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

/**
 * Convenience function for authenticated API calls (client-side)
 */
export async function apiClientWithAuth<T = unknown>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
    const token = getAuthToken();
    
    return apiClient<T>(endpoint, {
        ...options,
        headers: {
            ...createAuthHeaders(token),
            ...options.headers,
        },
    });
}

// Export types for consumers
export type { ApiClientOptions, ApiResponse };
