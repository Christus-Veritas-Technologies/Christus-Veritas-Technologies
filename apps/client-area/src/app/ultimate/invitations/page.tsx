"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/page-container";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = `${API_BASE}/api`;

interface Invitation {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CLIENT";
    status: "PENDING" | "ACCEPTED" | "CANCELLED" | "EXPIRED";
    createdAt: string;
    expiresAt: string;
    provisionServiceId: string | null;
    provisionUnits: number | null;
    provisionRecurring: boolean | null;
    provisionService?: {
        id: string;
        name: string;
    } | null;
}

interface ServiceDefinition {
    id: string;
    name: string;
    description: string | null;
    oneOffPrice: number | null;
    recurringPrice: number | null;
    recurringPricePerUnit: boolean;
    billingCycleDays: number;
}

interface InviteFormData {
    email: string;
    name: string;
    role: "ADMIN" | "CLIENT";
    provisionService: boolean;
    serviceDefinitionId: string;
    units: number;
    enableRecurring: boolean;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const stepVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 100 : -100,
        opacity: 0,
    }),
};

export default function InvitationsPage() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [serviceDefinitions, setServiceDefinitions] = useState<ServiceDefinition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inviteForm, setInviteForm] = useState<InviteFormData>({
        email: "",
        name: "",
        role: "CLIENT",
        provisionService: false,
        serviceDefinitionId: "",
        units: 1,
        enableRecurring: true,
    });

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];
    };

    const fetchInvitations = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/invitations`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setInvitations(data);
            }
        } catch (error) {
            console.error("Failed to fetch invitations:", error);
        }
    };

    const fetchServiceDefinitions = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/services/definitions`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setServiceDefinitions(data);
            }
        } catch (error) {
            console.error("Failed to fetch service definitions:", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchInvitations(), fetchServiceDefinitions()]);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const nextStep = () => {
        setDirection(1);
        setCurrentStep((prev) => Math.min(prev + 1, getSteps().length - 1));
    };

    const prevStep = () => {
        setDirection(-1);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const resetForm = () => {
        setInviteForm({
            email: "",
            name: "",
            role: "CLIENT",
            provisionService: false,
            serviceDefinitionId: "",
            units: 1,
            enableRecurring: true,
        });
        setCurrentStep(0);
        setDirection(0);
    };

    const handleSendInvitation = async () => {
        setIsSubmitting(true);
        try {
            const authToken = getAuthToken();
            const body: Record<string, unknown> = {
                email: inviteForm.email,
                name: inviteForm.name,
                role: inviteForm.role,
            };

            if (inviteForm.role === "CLIENT" && inviteForm.provisionService && inviteForm.serviceDefinitionId) {
                body.provisionServiceId = inviteForm.serviceDefinitionId;
                body.provisionUnits = inviteForm.units;
                body.provisionRecurring = inviteForm.enableRecurring;
            }

            const response = await fetch(`${API_URL}/invitations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setInviteDialogOpen(false);
                resetForm();
                await fetchInvitations();
            }
        } catch (error) {
            console.error("Failed to send invitation:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendInvitation = async (id: string) => {
        try {
            const authToken = getAuthToken();
            await fetch(`${API_URL}/invitations/${id}/resend`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            await fetchInvitations();
        } catch (error) {
            console.error("Failed to resend invitation:", error);
        }
    };

    const handleCancelInvitation = async (id: string) => {
        try {
            const authToken = getAuthToken();
            await fetch(`${API_URL}/invitations/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            await fetchInvitations();
        } catch (error) {
            console.error("Failed to cancel invitation:", error);
        }
    };

    const selectedService = serviceDefinitions.find(
        (s) => s.id === inviteForm.serviceDefinitionId
    );

    const getSteps = () => {
        const baseSteps = [
            {
                title: "User Details",
                description: "Enter the user's information",
                content: (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={inviteForm.name}
                                onChange={(e) =>
                                    setInviteForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={inviteForm.email}
                                onChange={(e) =>
                                    setInviteForm((prev) => ({ ...prev, email: e.target.value }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={inviteForm.role}
                                onValueChange={(value: "ADMIN" | "CLIENT") =>
                                    setInviteForm((prev) => ({ ...prev, role: value, provisionService: false }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CLIENT">Client</SelectItem>
                                    <SelectItem value="ADMIN">Admin (CVT Staff)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                {inviteForm.role === "ADMIN"
                                    ? "Admins can access the Ultimate dashboard and manage all users/services."
                                    : "Clients can access the client portal to view their services and billing."}
                            </p>
                        </div>
                    </div>
                ),
                isValid: !!inviteForm.name.trim() && !!inviteForm.email.trim(),
            },
        ];

        // Add provision service step only for clients
        if (inviteForm.role === "CLIENT") {
            baseSteps.push({
                title: "Provision Service",
                description: "Optionally assign a service to this client",
                content: (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label>Provision a Service</Label>
                                <p className="text-sm text-muted-foreground">
                                    Assign a service when the client accepts the invitation
                                </p>
                            </div>
                            <Switch
                                checked={inviteForm.provisionService}
                                onCheckedChange={(checked) =>
                                    setInviteForm((prev) => ({ ...prev, provisionService: checked }))
                                }
                            />
                        </div>

                        {inviteForm.provisionService && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label>Select Service</Label>
                                    <div className="grid gap-2 max-h-48 overflow-y-auto">
                                        {serviceDefinitions.map((service) => (
                                            <motion.div
                                                key={service.id}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                            >
                                                <div
                                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${inviteForm.serviceDefinitionId === service.id
                                                        ? "border-primary ring-2 ring-primary ring-opacity-50"
                                                        : "hover:border-muted-foreground"
                                                        }`}
                                                    onClick={() =>
                                                        setInviteForm((prev) => ({
                                                            ...prev,
                                                            serviceDefinitionId: service.id,
                                                        }))
                                                    }
                                                >
                                                    <div className="font-medium">{service.name}</div>
                                                    <div className="flex gap-2 mt-1 text-xs">
                                                        {service.oneOffPrice && (
                                                            <span className="text-muted-foreground">
                                                                ${service.oneOffPrice} one-time
                                                            </span>
                                                        )}
                                                        {service.recurringPrice && (
                                                            <span className="text-muted-foreground">
                                                                ${service.recurringPrice}
                                                                {service.recurringPricePerUnit ? "/unit" : ""} recurring
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {inviteForm.serviceDefinitionId && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="units">Number of Units</Label>
                                            <Input
                                                id="units"
                                                type="number"
                                                min={1}
                                                value={inviteForm.units}
                                                onChange={(e) =>
                                                    setInviteForm((prev) => ({
                                                        ...prev,
                                                        units: parseInt(e.target.value) || 1,
                                                    }))
                                                }
                                            />
                                        </div>

                                        {selectedService?.recurringPrice && (
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Enable Recurring Billing</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Bill client on recurring basis
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={inviteForm.enableRecurring}
                                                    onCheckedChange={(checked) =>
                                                        setInviteForm((prev) => ({
                                                            ...prev,
                                                            enableRecurring: checked,
                                                        }))
                                                    }
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        )}

                        {serviceDefinitions.length === 0 && inviteForm.provisionService && (
                            <p className="text-center text-muted-foreground py-4">
                                No services available. Create a service first.
                            </p>
                        )}
                    </div>
                ),
                isValid: !inviteForm.provisionService || !!inviteForm.serviceDefinitionId,
            });
        }

        // Add review step
        baseSteps.push({
            title: "Review",
            description: "Confirm invitation details",
            content: (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Invitation Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Name</span>
                                <span className="font-medium">{inviteForm.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email</span>
                                <span className="font-medium">{inviteForm.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Role</span>
                                <Badge variant={inviteForm.role === "ADMIN" ? "default" : "secondary"}>
                                    {inviteForm.role === "ADMIN" ? "Admin" : "Client"}
                                </Badge>
                            </div>
                            {inviteForm.role === "CLIENT" && inviteForm.provisionService && selectedService && (
                                <>
                                    <hr />
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Service</span>
                                        <span className="font-medium">{selectedService.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Units</span>
                                        <span className="font-medium">{inviteForm.units}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Recurring</span>
                                        <span className="font-medium">
                                            {inviteForm.enableRecurring ? "Yes" : "No"}
                                        </span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <p className="text-sm text-muted-foreground text-center">
                        The user will receive an email with their temporary login credentials.
                    </p>
                </div>
            ),
            isValid: true,
        });

        return baseSteps;
    };

    const steps = getSteps();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    const pendingCount = invitations.filter((i) => i.status === "PENDING").length;
    const acceptedCount = invitations.filter((i) => i.status === "ACCEPTED").length;
    const expiredCount = invitations.filter((i) => i.status === "EXPIRED" || i.status === "CANCELLED").length;

    return (
        <PageContainer>
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Invitations</h1>
                    <p className="text-muted-foreground mt-1">
                        Send and manage user invitations
                    </p>
                </div>
                <Dialog open={inviteDialogOpen} onOpenChange={(open) => {
                    setInviteDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            Send Invitation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Send Invitation</DialogTitle>
                            <DialogDescription>
                                Invite a new user to join the platform
                            </DialogDescription>
                        </DialogHeader>

                        {/* Step Progress */}
                        <div className="flex items-center justify-center gap-2 py-4">
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-center">
                                    <motion.div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStep
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                            }`}
                                        animate={{
                                            scale: index === currentStep ? 1.1 : 1,
                                        }}
                                    >
                                        {index < currentStep ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </motion.div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-12 h-0.5 mx-1 ${index < currentStep ? "bg-primary" : "bg-muted"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step Content */}
                        <div className="min-h-[300px] relative overflow-hidden">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <div className="text-center mb-4">
                                        <h3 className="font-semibold">{steps[currentStep].title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {steps[currentStep].description}
                                        </p>
                                    </div>
                                    {steps[currentStep].content}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                            >
                                Back
                            </Button>
                            {currentStep < steps.length - 1 ? (
                                <Button
                                    onClick={nextStep}
                                    disabled={!steps[currentStep].isValid}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSendInvitation}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                        />
                                    ) : null}
                                    {isSubmitting ? "Sending..." : "Send Invitation"}
                                </Button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Sent</p>
                                <p className="text-2xl font-bold">{invitations.length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Accepted</p>
                                <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Expired/Cancelled</p>
                                <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Invitations Table */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Invitations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {invitations.length === 0 ? (
                            <div className="text-center py-8">
                                <svg
                                    className="mx-auto h-12 w-12 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium">No invitations yet</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Send your first invitation to get started
                                </p>
                                <Button className="mt-4" onClick={() => setInviteDialogOpen(true)}>
                                    Send Invitation
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Recipient</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Sent</TableHead>
                                        <TableHead>Expires</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invitations.map((invitation) => (
                                        <TableRow key={invitation.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{invitation.name}</p>
                                                    <p className="text-sm text-muted-foreground">{invitation.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={invitation.role === "ADMIN" ? "default" : "secondary"}>
                                                    {invitation.role === "ADMIN" ? "Admin" : "Client"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {invitation.provisionService ? (
                                                    <Badge variant="outline">
                                                        {invitation.provisionService.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        invitation.status === "PENDING"
                                                            ? "secondary"
                                                            : invitation.status === "ACCEPTED"
                                                                ? "default"
                                                                : "destructive"
                                                    }
                                                >
                                                    {invitation.status.charAt(0) + invitation.status.slice(1).toLowerCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(invitation.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(invitation.expiresAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {(invitation.status === "PENDING" || invitation.status === "EXPIRED") && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleResendInvitation(invitation.id)}
                                                        >
                                                            Resend
                                                        </Button>
                                                    )}
                                                    {invitation.status !== "ACCEPTED" && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={() => handleCancelInvitation(invitation.id)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </PageContainer>
    );
}
