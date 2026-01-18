"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface NotificationSettings {
    emailNewUser: boolean;
    emailNewPayment: boolean;
    emailNewService: boolean;
    emailWeeklySummary: boolean;
    inAppNotifications: boolean;
}

export interface AppSettings {
    theme: "light" | "dark" | "system";
    accentColor: string;
    showAnimations: boolean;
    language: string;
    timezone: string;
    notifications: NotificationSettings;
}

const defaultSettings: AppSettings = {
    theme: "light",
    accentColor: "#4146F8",
    showAnimations: true,
    language: "en",
    timezone: "UTC",
    notifications: {
        emailNewUser: true,
        emailNewPayment: true,
        emailNewService: true,
        emailWeeklySummary: true,
        inAppNotifications: true,
    },
};

interface SettingsContextType {
    settings: AppSettings;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
    updateNotifications: (newNotifications: Partial<NotificationSettings>) => void;
    setTheme: (theme: "light" | "dark" | "system") => void;
    setAccentColor: (color: string) => void;
    shouldShowNotification: () => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Predefined accent colors
export const ACCENT_COLORS = [
    { name: "Dark", value: "#1f2937" },
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#10b981" },
    { name: "Blue", value: "#4146F8" },
    { name: "Purple", value: "#8b5cf6" },
];

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("app-settings");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setSettings({ ...defaultSettings, ...parsed });
            } catch (e) {
                console.error("Failed to parse settings:", e);
            }
        }
        setIsHydrated(true);
    }, []);

    // Apply theme and accent color to document
    useEffect(() => {
        if (!isHydrated) return;

        const root = document.documentElement;
        
        // Apply theme
        const effectiveTheme = settings.theme === "system" 
            ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
            : settings.theme;
        
        root.classList.remove("light", "dark");
        root.classList.add(effectiveTheme);
        
        // Apply accent color as CSS custom property
        root.style.setProperty("--accent-color", settings.accentColor);
        
        // Set primary color directly (used by Tailwind)
        root.style.setProperty("--primary", settings.accentColor);
        
        // Apply animations preference
        if (!settings.showAnimations) {
            root.style.setProperty("--animation-duration", "0s");
            root.classList.add("no-animations");
        } else {
            root.style.removeProperty("--animation-duration");
            root.classList.remove("no-animations");
        }

        // Save to localStorage
        localStorage.setItem("app-settings", JSON.stringify(settings));
    }, [settings, isHydrated]);

    // Listen for system theme changes
    useEffect(() => {
        if (settings.theme !== "system") return;
        
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(e.matches ? "dark" : "light");
        };
        
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [settings.theme]);

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    const updateNotifications = (newNotifications: Partial<NotificationSettings>) => {
        setSettings((prev) => ({
            ...prev,
            notifications: { ...prev.notifications, ...newNotifications },
        }));
    };

    const setTheme = (theme: "light" | "dark" | "system") => {
        updateSettings({ theme });
    };

    const setAccentColor = (color: string) => {
        updateSettings({ accentColor: color });
    };

    const shouldShowNotification = () => {
        return settings.notifications.inAppNotifications;
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                updateSettings,
                updateNotifications,
                setTheme,
                setAccentColor,
                shouldShowNotification,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}

// Helper function to convert hex to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } {
    // Remove # if present
    hex = hex.replace(/^#/, "");

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}
