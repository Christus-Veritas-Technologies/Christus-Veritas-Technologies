"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    GearSix,
    Bell,
    Check,
    CaretDown,
    X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useSettings, ACCENT_COLORS } from "@/contexts/settings-context";
import { toast } from "sonner";

export default function SettingsPage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [activeSection, setActiveSection] = useState("appearance");
    const [expandedMenus, setExpandedMenus] = useState<string[]>(["general"]);

    const { settings, setTheme, setAccentColor, updateSettings, updateNotifications } = useSettings();

    const handleClose = () => {
        setIsOpen(false);
        router.push("/ultimate/dashboard");
    };

    const toggleMenu = (menu: string) => {
        setExpandedMenus((prev) =>
            prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
        );
    };

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-[90vw] md:w-[75vw] max-w-none h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
                <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
                    <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden w-full">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0 border-r bg-gray-50/50 dark:bg-gray-900/50 overflow-y-auto">
                        <nav className="p-4 space-y-1">
                            {/* General Menu */}
                            <div>
                                <button
                                    onClick={() => toggleMenu("general")}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        expandedMenus.includes("general")
                                            ? "text-gray-900 dark:text-gray-100"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <GearSix className="w-4 h-4" />
                                        General
                                    </div>
                                    <CaretDown
                                        className={cn(
                                            "w-4 h-4 transition-transform",
                                            expandedMenus.includes("general") && "rotate-180"
                                        )}
                                    />
                                </button>
                                {expandedMenus.includes("general") && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        <button
                                            onClick={() => setActiveSection("appearance")}
                                            className={cn(
                                                "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
                                                activeSection === "appearance"
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            Appearance
                                        </button>
                                        <button
                                            onClick={() => setActiveSection("language")}
                                            className={cn(
                                                "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
                                                activeSection === "language"
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            Language & Region
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Notifications Menu */}
                            <div>
                                <button
                                    onClick={() => setActiveSection("notifications")}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        activeSection === "notifications"
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-4 h-4" />
                                        Notifications
                                    </div>
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto min-w-0">
                        <div className="p-8">
                            {/* Appearance Section */}
                            {activeSection === "appearance" && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Themes</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                            Choose your style or customize your theme
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <button
                                                onClick={() => setTheme("light")}
                                                className={cn(
                                                    "border-2 rounded-xl p-4 hover:shadow-lg transition-all bg-white dark:bg-gray-800",
                                                    settings.theme === "light" ? "border-primary" : "border-gray-200 dark:border-gray-700"
                                                )}
                                            >
                                                <div className="bg-white border rounded-t-lg p-2 mb-3">
                                                    <div className="flex gap-1 mb-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="h-2 bg-gray-200 rounded"></div>
                                                        <div className="h-2 bg-gray-100 rounded"></div>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                    {settings.theme === "light" && (
                                                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                    Light Mode
                                                </p>
                                            </button>

                                            <button
                                                onClick={() => setTheme("dark")}
                                                className={cn(
                                                    "border-2 rounded-xl p-4 hover:shadow-lg transition-all bg-white dark:bg-gray-800",
                                                    settings.theme === "dark" ? "border-primary" : "border-gray-200 dark:border-gray-700"
                                                )}
                                            >
                                                <div className="bg-gray-900 border border-gray-700 rounded-t-lg p-2 mb-3">
                                                    <div className="flex gap-1 mb-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="h-2 bg-gray-700 rounded"></div>
                                                        <div className="h-2 bg-gray-800 rounded"></div>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                    {settings.theme === "dark" && (
                                                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                    Dark Mode
                                                </p>
                                            </button>

                                            <button
                                                onClick={() => setTheme("system")}
                                                className={cn(
                                                    "border-2 rounded-xl p-4 hover:shadow-lg transition-all bg-white dark:bg-gray-800",
                                                    settings.theme === "system" ? "border-primary" : "border-gray-200 dark:border-gray-700"
                                                )}
                                            >
                                                <div className="bg-gradient-to-br from-white to-gray-900 border rounded-t-lg p-2 mb-3">
                                                    <div className="flex gap-1 mb-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="h-2 bg-gray-300 rounded"></div>
                                                        <div className="h-2 bg-gray-600 rounded"></div>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                    {settings.theme === "system" && (
                                                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                    System Preferences
                                                </p>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                            Accent Colors
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                            Use system or custom accent colors
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3">
                                            {ACCENT_COLORS.map((color) => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => setAccentColor(color.value)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-full hover:scale-110 transition-transform",
                                                        settings.accentColor === color.value
                                                            ? "ring-4 ring-primary ring-offset-2"
                                                            : "border-2 border-gray-300 dark:border-gray-600"
                                                    )}
                                                    style={{ backgroundColor: color.value }}
                                                    title={color.name}
                                                />
                                            ))}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Custom Color</span>
                                                <Input
                                                    type="color"
                                                    value={settings.accentColor}
                                                    onChange={(e) => setAccentColor(e.target.value)}
                                                    className="w-12 h-8 p-1 cursor-pointer"
                                                />
                                                <Input
                                                    type="text"
                                                    value={settings.accentColor}
                                                    onChange={(e) => setAccentColor(e.target.value)}
                                                    className="w-24 h-8 text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between py-4 border-y dark:border-gray-700">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                Show Animations
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Enable or disable UI animations
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.showAnimations}
                                            onCheckedChange={(checked) => updateSettings({ showAnimations: checked })}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Language Section */}
                            {activeSection === "language" && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                            Language & Region
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="language">Language</Label>
                                            <Select
                                                value={settings.language}
                                                onValueChange={(value) => updateSettings({ language: value })}
                                            >
                                                <SelectTrigger id="language">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="es">Spanish</SelectItem>
                                                    <SelectItem value="fr">French</SelectItem>
                                                    <SelectItem value="de">German</SelectItem>
                                                    <SelectItem value="pt">Portuguese</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="timezone">Timezone</Label>
                                            <Select
                                                value={settings.timezone}
                                                onValueChange={(value) => updateSettings({ timezone: value })}
                                            >
                                                <SelectTrigger id="timezone">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="UTC">UTC</SelectItem>
                                                    <SelectItem value="EST">EST (UTC-5)</SelectItem>
                                                    <SelectItem value="CST">CST (UTC-6)</SelectItem>
                                                    <SelectItem value="MST">MST (UTC-7)</SelectItem>
                                                    <SelectItem value="PST">PST (UTC-8)</SelectItem>
                                                    <SelectItem value="GMT">GMT (UTC+0)</SelectItem>
                                                    <SelectItem value="CET">CET (UTC+1)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                                        <Button onClick={handleSave}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Section */}
                            {activeSection === "notifications" && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                            Notifications
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            Choose what notifications you want to receive
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">In-App Notifications</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Show toast notifications within the app
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settings.notifications.inAppNotifications}
                                                onCheckedChange={(checked) =>
                                                    updateNotifications({ inAppNotifications: checked })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">New User Registration</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Get notified when a new user registers
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settings.notifications.emailNewUser}
                                                onCheckedChange={(checked) =>
                                                    updateNotifications({ emailNewUser: checked })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">New Payments</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Get notified when a payment is received
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settings.notifications.emailNewPayment}
                                                onCheckedChange={(checked) =>
                                                    updateNotifications({ emailNewPayment: checked })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">New Services</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Get notified when a new service is created
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settings.notifications.emailNewService}
                                                onCheckedChange={(checked) =>
                                                    updateNotifications({ emailNewService: checked })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">Weekly Summary</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Get a weekly summary of all activities
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settings.notifications.emailWeeklySummary}
                                                onCheckedChange={(checked) =>
                                                    updateNotifications({ emailWeeklySummary: checked })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                                        <Button onClick={handleSave}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
