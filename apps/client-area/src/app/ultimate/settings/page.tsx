"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/page-container";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    GearSix,
    Bell,
    Lock,
    Building,
    CreditCard,
    Eye,
    Copy,
    Check,
} from "@phosphor-icons/react";
import { apiClientWithAuth } from "@/lib/api-client";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [copied, setCopied] = useState(false);
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
        emailNewProject: true,
        emailWeeklySummary: true,
        emailSecurityAlerts: true,
        smsAlerts: false,
        inAppNotifications: true,
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
        employeeCount: "11-50",
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
            // In a real app, you'd make API calls to save settings
            // await apiClientWithAuth.put("/api/admin/settings", { ... })
            await new Promise((resolve) => setTimeout(resolve, 500));
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <PageContainer>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <GearSix weight="duotone" className="w-8 h-8" />
                        Settings
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your account, security, and preferences
                    </p>
                </div>

                {/* Settings Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 bg-gray-50">
                        <TabsTrigger value="general" className="flex items-center gap-2">
                            <GearSix className="w-4 h-4" />
                            General
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger value="business" className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Business
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Billing
                        </TabsTrigger>
                    </TabsList>

                    {/* General Settings */}
                    <TabsContent value="general" className="space-y-6">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                                <CardDescription>
                                    Update your account and company information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
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
                                </div>

                                <div className="grid grid-cols-2 gap-6">
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

                                <div className="flex justify-end pt-4 border-t">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notification Settings */}
                    <TabsContent value="notifications" className="space-y-6">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Email Notifications</CardTitle>
                                <CardDescription>
                                    Choose what email notifications you want to receive
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
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
                                            <p className="font-medium text-gray-900">New Projects</p>
                                            <p className="text-sm text-gray-600">
                                                Get notified when a new project is created
                                            </p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.emailNewProject}
                                            onCheckedChange={(checked) =>
                                                handleNotificationChange("emailNewProject", checked)
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

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
                                        <div>
                                            <p className="font-medium text-gray-900">Security Alerts</p>
                                            <p className="text-sm text-gray-600">
                                                Critical security notifications (recommended: on)
                                            </p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.emailSecurityAlerts}
                                            onCheckedChange={(checked) =>
                                                handleNotificationChange("emailSecurityAlerts", checked)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Other Notifications</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">In-App Notifications</p>
                                                <p className="text-sm text-gray-600">
                                                    Show notifications within the application
                                                </p>
                                            </div>
                                            <Switch
                                                checked={notificationSettings.inAppNotifications}
                                                onCheckedChange={(checked) =>
                                                    handleNotificationChange("inAppNotifications", checked)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">SMS Alerts</p>
                                                <p className="text-sm text-gray-600">
                                                    Receive critical alerts via SMS
                                                </p>
                                            </div>
                                            <Switch
                                                checked={notificationSettings.smsAlerts}
                                                onCheckedChange={(checked) =>
                                                    handleNotificationChange("smsAlerts", checked)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Settings */}
                    <TabsContent value="security" className="space-y-6">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>
                                    Manage your account security and authentication
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
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

                                <div className="border-t pt-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Session Management</h3>
                                    <div className="grid grid-cols-2 gap-6">
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
                                                    <SelectItem value="480">8 hours</SelectItem>
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
                                                    <SelectItem value="365">365 days</SelectItem>
                                                    <SelectItem value="999">Never expire</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">API Keys</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <Eye className="w-4 h-4 text-gray-600" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-mono text-gray-600">
                                                        sk_live_**************************4567
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Created Jan 1, 2024
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    copyToClipboard("sk_live_1234567890abcdef4567")
                                                }
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4 mr-1" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Business Settings */}
                    <TabsContent value="business" className="space-y-6">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Business Settings</CardTitle>
                                <CardDescription>
                                    Configure your business information and preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
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
                                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                                <SelectItem value="finance">Finance</SelectItem>
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
                                                <SelectItem value="agency">Agency</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="employeeCount">Employee Count</Label>
                                        <Select
                                            value={businessSettings.employeeCount}
                                            onValueChange={(value) =>
                                                handleBusinessChange("employeeCount", value)
                                            }
                                        >
                                            <SelectTrigger id="employeeCount">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1-10">1-10</SelectItem>
                                                <SelectItem value="11-50">11-50</SelectItem>
                                                <SelectItem value="51-100">51-100</SelectItem>
                                                <SelectItem value="101-500">101-500</SelectItem>
                                                <SelectItem value="500+">500+</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                </div>

                                <div className="flex justify-end pt-4 border-t">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Billing Settings */}
                    <TabsContent value="billing" className="space-y-6">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Billing Settings</CardTitle>
                                <CardDescription>
                                    Configure invoicing and billing preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
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

                                <div className="grid grid-cols-2 gap-6">
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
                                                <SelectItem value="90">Net 90</SelectItem>
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
                                                <SelectItem value="CAD">CAD ($)</SelectItem>
                                                <SelectItem value="AUD">AUD ($)</SelectItem>
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
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </PageContainer>
    );
}
