"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    User,
    EnvelopeSimple,
    Phone,
    Buildings,
    MapPin,
    PencilSimple,
    Lock,
    CheckCircle,
    Shield,
    CreditCard,
    DeviceMobile,
    Trash,
    Star,
    Spinner,
} from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useUser,
    useUpdateProfile,
    useSavedPaymentMethods,
    useAddCardPaymentMethod,
    useAddMobileMoneyPaymentMethod,
    useDeletePaymentMethod,
    useSetDefaultPaymentMethod,
} from "@/lib/api";

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

function AccountLoadingSkeleton() {
    return (
        <div className="p-6 space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-10 w-28" />
            </div>

            {/* Profile card skeleton */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                        <Skeleton className="w-20 h-20 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-5 w-28 rounded-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personal information skeleton */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="h-6 w-40" />
                    </div>
                    <Skeleton className="h-4 w-32 mt-1" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Payment methods skeleton */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-28" />
                            <Skeleton className="h-9 w-36" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 rounded-lg" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function AddCardDialog() {
    const [open, setOpen] = useState(false);
    const [cardBrand, setCardBrand] = useState<"VISA" | "MASTERCARD">("VISA");
    const [cardLast4, setCardLast4] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardExpMonth, setCardExpMonth] = useState("");
    const [cardExpYear, setCardExpYear] = useState("");
    const [isDefault, setIsDefault] = useState(false);

    const addCard = useAddCardPaymentMethod();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addCard.mutateAsync({
                cardBrand,
                cardLast4,
                cardHolderName,
                cardExpMonth: parseInt(cardExpMonth),
                cardExpYear: parseInt(cardExpYear),
                isDefault,
            });
            setOpen(false);
            setCardLast4("");
            setCardHolderName("");
            setCardExpMonth("");
            setCardExpYear("");
            setIsDefault(false);
        } catch (error) {
            console.error("Failed to add card:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <CreditCard weight="regular" className="w-4 h-4" />
                    Add Card
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Card</DialogTitle>
                    <DialogDescription>
                        Add a VISA or Mastercard for future payments.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Card Type</Label>
                        <Select value={cardBrand} onValueChange={(v) => setCardBrand(v as "VISA" | "MASTERCARD")}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="VISA">VISA</SelectItem>
                                <SelectItem value="MASTERCARD">Mastercard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Cardholder Name</Label>
                        <Input
                            placeholder="John Doe"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label>Last 4 Digits</Label>
                        <Input
                            placeholder="1234"
                            maxLength={4}
                            value={cardLast4}
                            onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ""))}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Exp Month</Label>
                            <Select value={cardExpMonth} onValueChange={setCardExpMonth}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>
                                            {String(i + 1).padStart(2, "0")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Exp Year</Label>
                            <Select value={cardExpYear} onValueChange={setCardExpYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const year = new Date().getFullYear() + i;
                                        return (
                                            <SelectItem key={year} value={String(year)}>
                                                {year}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="defaultCard"
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="defaultCard" className="font-normal">Set as default payment method</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={addCard.isPending}>
                        {addCard.isPending ? <Spinner className="w-4 h-4 animate-spin mr-2" /> : null}
                        Add Card
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function AddMobileMoneyDialog() {
    const [open, setOpen] = useState(false);
    const [provider, setProvider] = useState<"ECOCASH" | "ONEMONEY" | "INNBUCKS">("ECOCASH");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isDefault, setIsDefault] = useState(false);

    const addMobile = useAddMobileMoneyPaymentMethod();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addMobile.mutateAsync({
                mobileProvider: provider,
                mobileNumber: phoneNumber,
                isDefault,
            });
            setOpen(false);
            setPhoneNumber("");
            setIsDefault(false);
        } catch (error) {
            console.error("Failed to add mobile money:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <DeviceMobile weight="regular" className="w-4 h-4" />
                    Add Mobile Money
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Mobile Money</DialogTitle>
                    <DialogDescription>
                        Add your Ecocash, OneMoney, or Innbucks number for payments.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Provider</Label>
                        <Select value={provider} onValueChange={(v) => setProvider(v as "ECOCASH" | "ONEMONEY" | "INNBUCKS")}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ECOCASH">Ecocash</SelectItem>
                                <SelectItem value="ONEMONEY">OneMoney</SelectItem>
                                <SelectItem value="INNBUCKS">Innbucks</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Phone Number</Label>
                        <Input
                            placeholder="0771234567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Enter Zimbabwe phone number (e.g., 0771234567)
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="defaultMobile"
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="defaultMobile" className="font-normal">Set as default payment method</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={addMobile.isPending}>
                        {addMobile.isPending ? <Spinner className="w-4 h-4 animate-spin mr-2" /> : null}
                        Add Mobile Money
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function AccountPage() {
    const { data: user, isLoading: userLoading } = useUser();
    const { data: paymentMethods, isLoading: methodsLoading } = useSavedPaymentMethods();
    const updateProfile = useUpdateProfile();
    const deletePaymentMethod = useDeletePaymentMethod();
    const setDefaultPaymentMethod = useSetDefaultPaymentMethod();

    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const [editForm, setEditForm] = useState({
        name: "",
        phoneNumber: "",
    });

    // Initialize edit form when user loads
    const handleStartEdit = () => {
        setEditForm({
            name: user?.name || "",
            phoneNumber: user?.phoneNumber || "",
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync(editForm);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile:", error);
        }
    };

    const handlePasswordChange = async () => {
        setPasswordError("");
        setPasswordSuccess(false);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return;
        }

        try {
            // TODO: Call password change API
            setPasswordSuccess(true);
            setTimeout(() => {
                setIsPasswordDialogOpen(false);
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setPasswordSuccess(false);
            }, 2000);
        } catch {
            setPasswordError("Failed to change password");
        }
    };

    const getRoleBadge = (isAdmin: boolean) => {
        if (isAdmin) {
            return (
                <Badge className="bg-primary text-white hover:bg-primary gap-1">
                    <Shield weight="fill" className="w-3 h-3" />
                    Admin
                </Badge>
            );
        }
        return (
            <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/10 gap-1">
                <User weight="fill" className="w-3 h-3" />
                Client
            </Badge>
        );
    };

    const isLoading = userLoading || methodsLoading;

    if (isLoading) {
        return <AccountLoadingSkeleton />;
    }

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
                        Manage your personal information and payment methods
                    </p>
                </div>
                <Button
                    variant={isEditing ? "outline" : "default"}
                    className={!isEditing ? "bg-primary hover:bg-primary/90" : ""}
                    onClick={() => isEditing ? setIsEditing(false) : handleStartEdit()}
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
                                {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold">
                                        {user?.name || "No name set"}
                                    </h2>
                                    {getRoleBadge(user?.isAdmin || false)}
                                </div>
                                <p className="text-muted-foreground">{user?.email}</p>
                                {user?.emailVerified && (
                                    <Badge variant="outline" className="mt-2 gap-1 text-green-600 border-green-200">
                                        <CheckCircle weight="fill" className="w-3 h-3" />
                                        Email Verified
                                    </Badge>
                                )}
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
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={isEditing ? editForm.name : (user?.name || "")}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Enter your name"
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
                                    value={user?.email || ""}
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
                                    value={isEditing ? editForm.phoneNumber : (user?.phoneNumber || "")}
                                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Member Since</Label>
                                <Input
                                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric"
                                    }) : ""}
                                    disabled
                                    className="bg-gray-50"
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
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleSave}
                        disabled={updateProfile.isPending}
                    >
                        {updateProfile.isPending ? <Spinner className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save Changes
                    </Button>
                </motion.div>
            )}

            {/* Payment Methods */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard weight="duotone" className="w-5 h-5 text-primary" />
                                <div>
                                    <CardTitle>Payment Methods</CardTitle>
                                    <CardDescription>
                                        Manage your saved cards and mobile money accounts
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <AddCardDialog />
                                <AddMobileMoneyDialog />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {methodsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Spinner className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : paymentMethods && paymentMethods.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`relative p-4 rounded-lg border-2 ${method.isDefault ? "border-primary bg-primary/5" : "border-gray-200"
                                            }`}
                                    >
                                        {method.isDefault && (
                                            <Badge className="absolute -top-2 -right-2 bg-primary gap-1">
                                                <Star weight="fill" className="w-3 h-3" />
                                                Default
                                            </Badge>
                                        )}
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                {method.type === "CARD" ? (
                                                    <CreditCard weight="duotone" className="w-5 h-5 text-gray-600" />
                                                ) : (
                                                    <DeviceMobile weight="duotone" className="w-5 h-5 text-gray-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{method.nickname}</p>
                                                {method.type === "CARD" ? (
                                                    <p className="text-sm text-muted-foreground">
                                                        Expires {method.cardExpMonth?.toString().padStart(2, "0")}/{method.cardExpYear}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        {method.mobileProvider}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            {!method.isDefault && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDefaultPaymentMethod.mutate(method.id)}
                                                    disabled={setDefaultPaymentMethod.isPending}
                                                >
                                                    Set Default
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => deletePaymentMethod.mutate(method.id)}
                                                disabled={deletePaymentMethod.isPending}
                                            >
                                                <Trash weight="regular" className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <CreditCard weight="duotone" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No payment methods saved</p>
                                <p className="text-sm">Add a card or mobile money account above</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Security Section */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Lock weight="duotone" className="w-5 h-5 text-primary" />
                            <CardTitle>Security</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your password and security settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Password</p>
                                <p className="text-sm text-muted-foreground">
                                    Change your account password
                                </p>
                            </div>
                            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Lock weight="regular" className="w-4 h-4" />
                                        Change Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Change Password</DialogTitle>
                                        <DialogDescription>
                                            Enter your current password and a new password to update your credentials.
                                        </DialogDescription>
                                    </DialogHeader>

                                    {passwordSuccess ? (
                                        <div className="py-6 text-center">
                                            <CheckCircle weight="fill" className="w-12 h-12 text-green-600 mx-auto mb-3" />
                                            <p className="font-medium text-green-600">Password changed successfully!</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPassword">Current Password</Label>
                                                    <Input
                                                        id="currentPassword"
                                                        type="password"
                                                        value={passwordForm.currentPassword}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                        placeholder="Enter current password"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="newPassword">New Password</Label>
                                                    <Input
                                                        id="newPassword"
                                                        type="password"
                                                        value={passwordForm.newPassword}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                        placeholder="Enter new password"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                    <Input
                                                        id="confirmPassword"
                                                        type="password"
                                                        value={passwordForm.confirmPassword}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                                {passwordError && (
                                                    <p className="text-sm text-red-600">{passwordError}</p>
                                                )}
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handlePasswordChange}
                                                    className="bg-primary hover:bg-primary/90"
                                                    disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                                                >
                                                    Change Password
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

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
