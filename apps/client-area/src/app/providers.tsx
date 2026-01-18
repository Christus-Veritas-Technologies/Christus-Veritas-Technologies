"use client";

import { SettingsProvider } from "@/contexts/settings-context";
import { QueryProvider } from "@/lib/query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SettingsProvider>
            <QueryProvider>
                {children}
            </QueryProvider>
        </SettingsProvider>
    );
}
