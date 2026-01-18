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
    Building,
    CreditCard,
    Check,
    User,
    ShieldCheck,
    CaretDown,
    X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [activeSection, setActiveSection] = useState("appearance");
    const [expandedMenus, setExpandedMenus] = useState<string[]>(["general"]);
    const [isSaving, setIsSaving] = useState(false);

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        companyName: "Christus Veritas Technologies",
        email: "admin@christusveritas.com",
        phone: "+1 (555) 123-4567",
        timezone: "UTC",
        language: "en",
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNewUser: true,
        emailNewPayment: true,
        emailNewService: true,
        emailWeeklySummary: true,
    });

    // Security Settings
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorEnabled: false,
        loginAlerts: true,
        sessionTimeout: "30",
        passwordExpiry: "90",
    });

    // Business Settings
    const [businessSettings, setBusinessSettings] = useState({
        businessType: "technology",
        industry: "software",
        website: "https://christusveritas.com",
    });

    // Billing Settings
    const [billingSettings, setBillingSettings] = useState({
        invoicePrefix: "INV",
        invoiceStartNumber: "1000",
        paymentTerms: "30",
        defaultCurrency: "USD",
        taxId: "12-3456789",
    });

    const handleClose = () => {
        setIsOpen(false);
        router.push("/ultimate/dashboard");
    };

    const toggleMenu = (menu: string) => {
        setExpandedMenus((prev) =>
            prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
        );
    };

    const handleGeneralChange = (field: string, value: string) => {
        setGeneralSettings({ ...generalSettings, [field]: value });
    };

    const handleNotificationChange = (field: string, value: boolean) => {
        setNotificationSettings({ ...notificationSettings, [field]: value });
    };

    const handleSecurityChange = (field: string, value: string | boolean) => {
        setSecuritySettings({ ...securitySettings, [field]: value });
    };

    const handleBusinessChange = (field: string, value: string) => {
        setBusinessSettings({ ...businessSettings, [field]: value });
    };

    const handleBillingChange = (field: string, value: string) => {
        setBillingSettings({ ...billingSettings, [field]: value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-5xl h-[90vh] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>

                <div className="flex h-full overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 border-r bg-gray-50/50 overflow-y-auto">
                        <nav className="p-4 space-y-1">
                            {/* General Menu */}
                            <div>
                                <button
                                    onClick={() => toggleMenu("general")}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        expandedMenus.includes("general")
                                            ? "text-gray-900"
                                            : "text-gray-600 hover:bg-gray-100"
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
                                                    : "text-gray-600 hover:bg-gray-100"
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
                                                    : "text-gray-600 hover:bg-gray-100"
                                            )}
                                        >
                                            Language & Region
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Account Menu */}
                            <div>
                                <button
                                    onClick={() => setActiveSection("account")}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        activeSection === "account"
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Account
                                    </div>
                                </button>
                            </div>

                            {/* Billing Menu */}
                            <div>
                                <button
                                    onClick={() => setActiveSection("billing")}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        activeSection === "billing"
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Plans & Billing
                                    </div>
                                </button>
                            </div>

                            {/* Security Menu */}
                            <div>
                                <button
                                    onClick={() => setActiveSection("security")}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        activeSection === "security"
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" />
                                        Privacy & Security
                                    </div>
                                </button>
                            </div>

                            {/* Notifications Menu */}
                            <div>
                                <button
                                    onClick={() => setActiveSection("notifications")}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        activeSection === "notifications"
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-4 h-4" />
                                        Notifications
                                    </div>
                                </button>
                            </div>

                            {/* Business Menu */}
                            <div>
                                <button
                                    onClick={() => setActiveSection("business")}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        activeSection === "business"
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <Building className="w-4 h-4" />
                                        Business
                                    </div>
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8 max-w-3xl">
                            {/* Appearance Section */}
                            {activeSection === "appearance" && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Themes</h2>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Choose your style or customize your theme
                                        </p>
                                        <div className="grid grid-cols-3 gap-4">
                                            <button className="border-2 border-primary rounded-xl p-4 hover:shadow-lg transition-all bg-white">
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
                                                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                    Light Mode
                                                </p>
                                            </button>

                                            <button className="border rounded-xl p-4 hover:shadow-lg transition-all bg-white">
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
                                                <p className="text-sm font-medium text-gray-600">Dark Mode</p>
                                            </button>

                                            <button className="border rounded-xl p-4 hover:shadow-lg transition-all bg-white">
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
                                                <p className="text-sm font-medium text-gray-600">
                                                    System Preferences
                                                </p>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                            Accent Colors
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Use system or custom accent colors
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <button className="w-10 h-10 rounded-full bg-gray-900 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                                            <button className="w-10 h-10 rounded-full bg-red-500 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                                            <button className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                                            <button className="w-10 h-10 rounded-full bg-blue-500 border-4 border-primary shadow-lg"></button>
                                            <button className="w-10 h-10 rounded-full bg-purple-500 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                                            <div className="flex items-center gap-2 ml-4">
                                                <span className="text-sm text-gray-500">Custom Color</span>
                                                <Input
                                                    type="text"
                                                    value="#4146F8"
                                                    className="w-24 h-8 text-xs"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between py-4 border-y">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">
                                                Show Animations
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Enable or disable UI animations
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            )}

                            {/* Language Section */}
                            {activeSection === "language" && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                            Language & Region
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="language">Language</Label>
                                            <Select
                                                value={generalSettings.language}
                                                onValueChange={(value) =>
                                                    handleGeneralChange("language", value)
                                                }
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
                                                value={generalSettings.timezone}
                                                onValueChange={(value) =>
                                                    handleGeneralChange("timezone", value)
                                                }
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

                                    <div className="flex justify-end pt-4 border-t">
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Account Section */}
                            {activeSection === "account" && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                            Account Settings
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="companyName">Company Name</Label>
                                            <Input
                                                id="companyName"
                                                value={generalSettings.companyName}
                                                onChange={(e) =>
                                                    handleGeneralChange("companyName", e.target.value)
                                                }
                                                placeholder="Your company name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={generalSettings.email}
                                                onChange={(e) =>
                                                    handleGeneralChange("email", e.target.value)
                                                }
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                value={generalSettings.phone}
                                                onChange={(e) =>
                                                    handleGeneralChange("phone", e.target.value)
                                                }
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t">
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Section */}
                            {activeSection === "notifications" && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                            Email Notifications
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Choose what email notifications you want to receive
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">New User Registration</p>
                                                <p className="text-sm text-gray-600">
                                                    Get notified when a new user registers
                                                </p>
                                            </div>
                                            <Switch
                                                checked={notificationSettings.emailNewUser}
                                                onCheckedChange={(checked) =>
                                                    handleNotificationChange("emailNewUser", checked)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">New Payments</p>
                                                <p className="text-sm text-gray-600">
                                                    Get notified when a payment is received
                                                </p>
                                            </div>
                                            <Switch
                                                checked={notificationSettings.emailNewPayment}
                                                onCheckedChange={(checked) =>
                                                    handleNotificationChange("emailNewPayment", checked)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">New Services</p>
                                                <p className="text-sm text-gray-600">
                                                    Get notified when a new service is created
                                                </p>
                                            </div>
                                            <Switch
                                                checked={notificationSettings.emailNewService}
                                                onCheckedChange={(checked) =>
                                                    handleNotificationChange("emailNewService", checked)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">Weekly Summary</p>
                                                <p className="text-sm text-gray-600">
                                                    Get a weekly summary of all activities
                                                </p>
                                            </div>
                                            <Switch
                                                checked={notificationSettings.emailWeeklySummary}
                                                onCheckedChange={(checked) =>
                                                    handleNotificationChange("emailWeeklySummary", checked)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t">
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Security Section */}
                            {activeSection === "security" && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                            Security Settings
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Manage your account security and authentication
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-amber-200 bg-amber-50">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Two-Factor Authentication (2FA)
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Add an extra layer of security to your account
                                                </p>
                                            </div>
                                            <Switch
                                                checked={securitySettings.twoFactorEnabled}
                                                onCheckedChange={(checked) =>
                                                    handleSecurityChange("twoFactorEnabled", checked)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">Login Alerts</p>
                                                <p className="text-sm text-gray-600">
                                                    Get notified of login attempts from new devices
                                                </p>
                                            </div>
                                            <Switch
                                                checked={securitySettings.loginAlerts}
                                                onCheckedChange={(checked) =>
                                                    handleSecurityChange("loginAlerts", checked)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="font-semibold text-gray-900">Session Management</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="sessionTimeout">
                                                    Session Timeout (minutes)
                                                </Label>
                                                <Select
                                                    value={securitySettings.sessionTimeout}
                                                    onValueChange={(value) =>
                                                        handleSecurityChange("sessionTimeout", value)
                                                    }
                                                >
                                                    <SelectTrigger id="sessionTimeout">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="15">15 minutes</SelectItem>
                                                        <SelectItem value="30">30 minutes</SelectItem>
                                                        <SelectItem value="60">1 hour</SelectItem>
                                                        <SelectItem value="120">2 hours</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="passwordExpiry">
                                                    Password Expiry (days)
                                                </Label>
                                                <Select
                                                    value={securitySettings.passwordExpiry}
                                                    onValueChange={(value) =>
                                                        handleSecurityChange("passwordExpiry", value)
                                                    }
                                                >
                                                    <SelectTrigger id="passwordExpiry">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="30">30 days</SelectItem>
                                                        <SelectItem value="60">60 days</SelectItem>
                                                        <SelectItem value="90">90 days</SelectItem>
                                                        <SelectItem value="180">180 days</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t">
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Business Section */}
                            {activeSection === "business" && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                            Business Settings
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="businessType">Business Type</Label>
                                            <Select
                                                value={businessSettings.businessType}
                                                onValueChange={(value) =>
                                                    handleBusinessChange("businessType", value)
                                                }
                                            >
                                                <SelectTrigger id="businessType">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="technology">Technology</SelectItem>
                                                    <SelectItem value="services">Services</SelectItem>
                                                    <SelectItem value="retail">Retail</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="industry">Industry</Label>
                                            <Select
                                                value={businessSettings.industry}
                                                onValueChange={(value) =>
                                                    handleBusinessChange("industry", value)
                                                }
                                            >
                                                <SelectTrigger id="industry">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="software">Software</SelectItem>
                                                    <SelectItem value="consulting">Consulting</SelectItem>
                                                    <SelectItem value="saas">SaaS</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={businessSettings.website}
                                            onChange={(e) =>
                                                handleBusinessChange("website", e.target.value)
                                            }
                                            placeholder="https://example.com"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4 border-t">
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Billing Section */}
                            {activeSection === "billing" && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                            Billing Settings
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                                            <Input
                                                id="invoicePrefix"
                                                value={billingSettings.invoicePrefix}
                                                onChange={(e) =>
                                                    handleBillingChange("invoicePrefix", e.target.value)
                                                }
                                                placeholder="INV"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="invoiceStartNumber">
                                                Invoice Start Number
                                            </Label>
                                            <Input
                                                id="invoiceStartNumber"
                                                type="number"
                                                value={billingSettings.invoiceStartNumber}
                                                onChange={(e) =>
                                                    handleBillingChange("invoiceStartNumber", e.target.value)
                                                }
                                                placeholder="1000"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="paymentTerms">Payment Terms (days)</Label>
                                            <Select
                                                value={billingSettings.paymentTerms}
                                                onValueChange={(value) =>
                                                    handleBillingChange("paymentTerms", value)
                                                }
                                            >
                                                <SelectTrigger id="paymentTerms">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">Due on receipt</SelectItem>
                                                    <SelectItem value="15">Net 15</SelectItem>
                                                    <SelectItem value="30">Net 30</SelectItem>
                                                    <SelectItem value="60">Net 60</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="defaultCurrency">Default Currency</Label>
                                            <Select
                                                value={billingSettings.defaultCurrency}
                                                onValueChange={(value) =>
                                                    handleBillingChange("defaultCurrency", value)
                                                }
                                            >
                                                <SelectTrigger id="defaultCurrency">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="USD">USD ($)</SelectItem>
                                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                                    <SelectItem value="GBP">GBP (£)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                                        <Input
                                            id="taxId"
                                            value={billingSettings.taxId}
                                            onChange={(e) =>
                                                handleBillingChange("taxId", e.target.value)
                                            }
                                            placeholder="12-3456789"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4 border-t">
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? "Saving..." : "Save Changes"}
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
