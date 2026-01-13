"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Bell,
    EnvelopeSimple,
    Shield,
    Moon,
    Globe,
} from "@phosphor-icons/react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your preferences and notifications
                </p>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell weight="duotone" className="w-5 h-5 text-primary" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <CardDescription>
                            Choose how you want to be notified
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive email updates about your account
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Invoice Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get reminded before invoices are due
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Service Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Be notified about service status changes
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Marketing Emails</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive news and promotional offers
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Security */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield weight="duotone" className="w-5 h-5 text-primary" />
                            <CardTitle>Security</CardTitle>
                        </div>
                        <CardDescription>
                            Keep your account secure
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">
                                    Add an extra layer of security to your account
                                </p>
                            </div>
                            <Button variant="outline" size="sm">
                                Enable
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Password</Label>
                                <p className="text-sm text-muted-foreground">
                                    Last changed 30 days ago
                                </p>
                            </div>
                            <Button variant="outline" size="sm">
                                Change Password
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Active Sessions</Label>
                                <p className="text-sm text-muted-foreground">
                                    Manage devices logged into your account
                                </p>
                            </div>
                            <Button variant="outline" size="sm">
                                View Sessions
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Preferences */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe weight="duotone" className="w-5 h-5 text-primary" />
                            <CardTitle>Preferences</CardTitle>
                        </div>
                        <CardDescription>
                            Customize your experience
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Use dark theme for the dashboard
                                </p>
                            </div>
                            <Switch />
                        </div>
                        <div className="space-y-2">
                            <Label>Timezone</Label>
                            <Input
                                type="text"
                                defaultValue="Africa/Harare (UTC+02:00)"
                                disabled
                            />
                            <p className="text-sm text-muted-foreground">
                                Timezone is automatically detected
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Save Button */}
            <motion.div variants={itemVariants} className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90">
                    Save Changes
                </Button>
            </motion.div>
        </motion.div>
    );
}
