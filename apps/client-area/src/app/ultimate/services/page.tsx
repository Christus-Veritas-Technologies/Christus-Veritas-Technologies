"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/page-container";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = `${API_BASE}/api`;

interface ServiceDefinition {
    id: string;
    name: string;
    description: string | null;
    oneOffPrice: number | null;
    recurringPrice: number | null;
    recurringPricePerUnit: boolean;
    billingCycleDays: number;
    isActive: boolean;
    createdAt: string;
    _count?: {
        clientServices: number;
    };
}

interface CreateServiceForm {
    name: string;
    description: string;
    oneOffPrice: string;
    recurringPrice: string;
    recurringPricePerUnit: boolean;
    billingCycleDays: string;
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

export default function ServicesPage() {
    const [services, setServices] = useState<ServiceDefinition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createForm, setCreateForm] = useState<CreateServiceForm>({
        name: "",
        description: "",
        oneOffPrice: "",
        recurringPrice: "",
        recurringPricePerUnit: false,
        billingCycleDays: "30",
    });

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];
    };

    const fetchServices = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/services/definitions?includeInactive=true`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Failed to fetch services:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const nextStep = () => {
        setDirection(1);
        setCurrentStep((prev) => Math.min(prev + 1, 2));
    };

    const prevStep = () => {
        setDirection(-1);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const resetForm = () => {
        setCreateForm({
            name: "",
            description: "",
            oneOffPrice: "",
            recurringPrice: "",
            recurringPricePerUnit: false,
            billingCycleDays: "30",
        });
        setCurrentStep(0);
        setDirection(0);
    };

    const handleCreateService = async () => {
        setIsSubmitting(true);
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/services/definitions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    name: createForm.name,
                    description: createForm.description || undefined,
                    oneOffPrice: createForm.oneOffPrice ? parseFloat(createForm.oneOffPrice) : undefined,
                    recurringPrice: createForm.recurringPrice ? parseFloat(createForm.recurringPrice) : undefined,
                    recurringPricePerUnit: createForm.recurringPricePerUnit,
                    billingCycleDays: parseInt(createForm.billingCycleDays) || 30,
                }),
            });

            if (response.ok) {
                setCreateDialogOpen(false);
                resetForm();
                await fetchServices();
            }
        } catch (error) {
            console.error("Failed to create service:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleActive = async (serviceId: string, currentActive: boolean) => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/services/definitions/${serviceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    isActive: !currentActive,
                }),
            });

            if (response.ok) {
                await fetchServices();
            }
        } catch (error) {
            console.error("Failed to toggle service status:", error);
        }
    };

    const getBillingCycleLabel = (days: number) => {
        if (days === 1) return "Daily";
        if (days === 7) return "Weekly";
        if (days === 14) return "Bi-weekly";
        if (days === 30) return "Monthly";
        if (days === 90) return "Quarterly";
        if (days === 365) return "Yearly";
        return `Every ${days} days`;
    };

    const steps = [
        {
            title: "Basic Information",
            description: "Service name and description",
            content: (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Service Name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Website Development, SEO Package"
                            value={createForm.name}
                            onChange={(e) =>
                                setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe what this service includes..."
                            value={createForm.description}
                            onChange={(e) =>
                                setCreateForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            rows={4}
                        />
                    </div>
                </div>
            ),
            isValid: !!createForm.name.trim(),
        },
        {
            title: "Pricing",
            description: "Set pricing options",
            content: (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="oneOffPrice">One-Time Price (optional)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                                id="oneOffPrice"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="pl-7"
                                value={createForm.oneOffPrice}
                                onChange={(e) =>
                                    setCreateForm((prev) => ({ ...prev, oneOffPrice: e.target.value }))
                                }
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Charged once when the service is provisioned
                        </p>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="recurringPrice">Recurring Price (optional)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    id="recurringPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="pl-7"
                                    value={createForm.recurringPrice}
                                    onChange={(e) =>
                                        setCreateForm((prev) => ({ ...prev, recurringPrice: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        {createForm.recurringPrice && (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Price Per Unit</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Multiply price by number of units
                                        </p>
                                    </div>
                                    <Switch
                                        checked={createForm.recurringPricePerUnit}
                                        onCheckedChange={(checked) =>
                                            setCreateForm((prev) => ({ ...prev, recurringPricePerUnit: checked }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="billingCycleDays">Billing Cycle (days)</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: "Monthly", value: "30" },
                                            { label: "Quarterly", value: "90" },
                                            { label: "Yearly", value: "365" },
                                        ].map((option) => (
                                            <Button
                                                key={option.value}
                                                type="button"
                                                variant={createForm.billingCycleDays === option.value ? "default" : "outline"}
                                                size="sm"
                                                onClick={() =>
                                                    setCreateForm((prev) => ({ ...prev, billingCycleDays: option.value }))
                                                }
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                    <Input
                                        id="billingCycleDays"
                                        type="number"
                                        min="1"
                                        placeholder="Custom days"
                                        value={createForm.billingCycleDays}
                                        onChange={(e) =>
                                            setCreateForm((prev) => ({ ...prev, billingCycleDays: e.target.value }))
                                        }
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ),
            isValid: true, // Pricing is optional
        },
        {
            title: "Review",
            description: "Confirm service details",
            content: (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{createForm.name || "Untitled Service"}</CardTitle>
                            {createForm.description && (
                                <CardDescription>{createForm.description}</CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">One-time Price</span>
                                <span className="font-medium">
                                    {createForm.oneOffPrice ? `$${parseFloat(createForm.oneOffPrice).toFixed(2)}` : "None"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Recurring Price</span>
                                <span className="font-medium">
                                    {createForm.recurringPrice
                                        ? `$${parseFloat(createForm.recurringPrice).toFixed(2)}${createForm.recurringPricePerUnit ? "/unit" : ""}`
                                        : "None"}
                                </span>
                            </div>
                            {createForm.recurringPrice && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Billing Cycle</span>
                                    <span className="font-medium">
                                        {getBillingCycleLabel(parseInt(createForm.billingCycleDays) || 30)}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ),
            isValid: true,
        },
    ];

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

    const activeServices = services.filter((s) => s.isActive);
    const totalSubscribers = services.reduce((acc, s) => acc + (s._count?.clientServices || 0), 0);

    return (
        <PageContainer>
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Services</h1>
                    <p className="text-muted-foreground mt-1">
                        Define and manage your service offerings
                    </p>
                </div>
                <Dialog open={createDialogOpen} onOpenChange={(open) => {
                    setCreateDialogOpen(open);
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
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Create Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Create New Service</DialogTitle>
                            <DialogDescription>
                                Set up a new service offering for your clients
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
                                    onClick={handleCreateService}
                                    disabled={isSubmitting || !createForm.name.trim()}
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                        />
                                    ) : null}
                                    {isSubmitting ? "Creating..." : "Create Service"}
                                </Button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Services
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{services.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Services
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{activeServices.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Clients Subscribed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSubscribers}</div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Services Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Card className={!service.isActive ? "opacity-60" : ""}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{service.name}</CardTitle>
                                    <Badge variant={service.isActive ? "default" : "secondary"}>
                                        {service.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                {service.description && (
                                    <CardDescription className="line-clamp-2">
                                        {service.description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    {service.oneOffPrice !== null && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">One-time</span>
                                            <span className="font-medium">${service.oneOffPrice}</span>
                                        </div>
                                    )}
                                    {service.recurringPrice !== null && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Recurring</span>
                                            <span className="font-medium">
                                                ${service.recurringPrice}
                                                {service.recurringPricePerUnit ? "/unit" : ""} / {getBillingCycleLabel(service.billingCycleDays)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Clients</span>
                                        <span className="font-medium">{service._count?.clientServices || 0}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleToggleActive(service.id, service.isActive)}
                                    >
                                        {service.isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {services.length === 0 && (
                <motion.div variants={itemVariants} className="text-center py-12">
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
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium">No services yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create your first service to start provisioning to clients
                    </p>
                    <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                        Create Service
                    </Button>
                </motion.div>
            )}
        </PageContainer>
    );
}
