"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User,
    EnvelopeSimple,
    Phone,
    Buildings,
    MapPin,
    PencilSimple,
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

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    companyName: string;
    address: string;
    city: string;
    country: string;
}

export default function AccountPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        address: "",
        city: "",
        country: "",
    });

    useEffect(() => {
        // Fetch user profile
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/me`,
                    { credentials: 'include' }
                );
                if (response.ok) {
                    const data = await response.json();
                    setProfile({
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        email: data.email || "",
                        phoneNumber: data.phoneNumber || "",
                        companyName: data.companyName || "",
                        address: data.address || "",
                        city: data.city || "",
                        country: data.country || "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            // Save profile logic here
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile:", error);
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Account</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your personal information
                    </p>
                </div>
                <Button
                    variant={isEditing ? "outline" : "default"}
                    className={!isEditing ? "bg-primary hover:bg-primary/90" : ""}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <PencilSimple weight="regular" className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
            </motion.div>

            {/* Profile Picture & Name */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {profile.firstName} {profile.lastName}
                                </h2>
                                <p className="text-muted-foreground">{profile.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Personal Information */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User weight="duotone" className="w-5 h-5 text-primary" />
                            <CardTitle>Personal Information</CardTitle>
                        </div>
                        <CardDescription>
                            Your personal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-1">
                                    <EnvelopeSimple weight="regular" className="w-4 h-4" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="bg-gray-50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Contact support to change your email
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-1">
                                    <Phone weight="regular" className="w-4 h-4" />
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    value={profile.phoneNumber}
                                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Company Information */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Buildings weight="duotone" className="w-5 h-5 text-primary" />
                            <CardTitle>Company Information</CardTitle>
                        </div>
                        <CardDescription>
                            Your business details for invoicing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    value={profile.companyName}
                                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Enter company name"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address" className="flex items-center gap-1">
                                    <MapPin weight="regular" className="w-4 h-4" />
                                    Address
                                </Label>
                                <Input
                                    id="address"
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Enter street address"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={profile.city}
                                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Enter city"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={profile.country}
                                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Enter country"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Save Button */}
            {isEditing && (
                <motion.div
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end gap-3"
                >
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
                        Save Changes
                    </Button>
                </motion.div>
            )}

            {/* Danger Zone */}
            <motion.div variants={itemVariants}>
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        <CardDescription>
                            Irreversible account actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Delete Account</p>
                                <p className="text-sm text-muted-foreground">
                                    Permanently delete your account and all data
                                </p>
                            </div>
                            <Button variant="destructive" size="sm">
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
