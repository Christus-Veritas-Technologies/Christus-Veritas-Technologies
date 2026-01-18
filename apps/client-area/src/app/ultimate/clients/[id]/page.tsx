"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
}

interface ClientService {
    id: string;
    status: string;
    units: number;
    oneOffPricePaid: boolean;
    enableRecurring: boolean;
    customRecurringPrice: number | null;
    dateJoined: string;
    nextBillingDate: string | null;
    serviceDefinition: ServiceDefinition;
}

interface Client {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    clientServices: ClientService[];
}

// Multi-step provisioning form
interface ProvisionFormData {
    serviceDefinitionId: string;
    units: number;
    enableRecurring: boolean;
    customRecurringPrice: string;
}

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

export default function ClientDetailPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.id as string;

    const [client, setClient] = useState<Client | null>(null);
    const [serviceDefinitions, setServiceDefinitions] = useState<ServiceDefinition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [provisionDialogOpen, setProvisionDialogOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [provisionForm, setProvisionForm] = useState<ProvisionFormData>({
        serviceDefinitionId: "",
        units: 1,
        enableRecurring: true,
        customRecurringPrice: "",
    });

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];
    };

    const fetchClient = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/clients/${clientId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setClient(data);
            }
        } catch (error) {
            console.error("Failed to fetch client:", error);
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
            await Promise.all([fetchClient(), fetchServiceDefinitions()]);
            setIsLoading(false);
        };
        loadData();
    }, [clientId]);

    const selectedService = serviceDefinitions.find(
        (s) => s.id === provisionForm.serviceDefinitionId
    );

    const calculatePrice = () => {
        if (!selectedService) return { oneOff: 0, recurring: 0 };

        const oneOff = selectedService.oneOffPrice || 0;
        const customPrice = provisionForm.customRecurringPrice
            ? parseFloat(provisionForm.customRecurringPrice)
            : null;

        let recurring = 0;
        if (provisionForm.enableRecurring) {
            if (customPrice !== null) {
                recurring = customPrice;
            } else if (selectedService.recurringPrice) {
                recurring = selectedService.recurringPricePerUnit
                    ? selectedService.recurringPrice * provisionForm.units
                    : selectedService.recurringPrice;
            }
        }

        return { oneOff, recurring };
    };

    const nextStep = () => {
        setDirection(1);
        setCurrentStep((prev) => Math.min(prev + 1, 2));
    };

    const prevStep = () => {
        setDirection(-1);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const resetForm = () => {
        setProvisionForm({
            serviceDefinitionId: "",
            units: 1,
            enableRecurring: true,
            customRecurringPrice: "",
        });
        setCurrentStep(0);
        setDirection(0);
    };

    const handleProvisionService = async () => {
        setIsSubmitting(true);
        try {
            const authToken = getAuthToken();
            const response = await fetch(`${API_URL}/services/provision`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    userId: clientId,
                    serviceDefinitionId: provisionForm.serviceDefinitionId,
                    units: provisionForm.units,
                    enableRecurring: provisionForm.enableRecurring,
                    customRecurringPrice: provisionForm.customRecurringPrice
                        ? parseFloat(provisionForm.customRecurringPrice)
                        : undefined,
                }),
            });

            if (response.ok) {
                setProvisionDialogOpen(false);
                resetForm();
                await fetchClient();
            } else {
                console.error("Failed to provision service");
            }
        } catch (error) {
            console.error("Error provisioning service:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleServiceAction = async (
        serviceId: string,
        action: "mark-paid" | "pause" | "resume" | "cancel"
    ) => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(
                `${API_URL}/services/client-services/${serviceId}/${action}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (response.ok) {
                await fetchClient();
            }
        } catch (error) {
            console.error(`Failed to ${action} service:`, error);
        }
    };

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

    if (!client) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold">Client not found</h2>
                <Button className="mt-4" onClick={() => router.push("/ultimate/clients")}>
                    Back to Clients
                </Button>
            </div>
        );
    }

    const prices = calculatePrice();

    const steps = [
        {
            title: "Select Service",
            description: "Choose a service to provision",
            content: (
                <div className="space-y-4">
                    <div className="grid gap-3">
                        {serviceDefinitions.map((service) => (
                            <motion.div
                                key={service.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className={`cursor-pointer transition-all ${provisionForm.serviceDefinitionId === service.id
                                        ? "border-primary ring-2 ring-primary ring-opacity-50"
                                        : "hover:border-muted-foreground"
                                        }`}
                                    onClick={() =>
                                        setProvisionForm((prev) => ({
                                            ...prev,
                                            serviceDefinitionId: service.id,
                                        }))
                                    }
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">{service.name}</CardTitle>
                                        {service.description && (
                                            <CardDescription className="text-sm">
                                                {service.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2 text-sm">
                                            {service.oneOffPrice && (
                                                <Badge variant="outline">
                                                    ${service.oneOffPrice} one-time
                                                </Badge>
                                            )}
                                            {service.recurringPrice && (
                                                <Badge variant="secondary">
                                                    ${service.recurringPrice}
                                                    {service.recurringPricePerUnit ? "/unit" : ""} /
                                                    {service.billingCycleDays} days
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                    {serviceDefinitions.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                            No services available. Create a service first.
                        </p>
                    )}
                </div>
            ),
            isValid: !!provisionForm.serviceDefinitionId,
        },
        {
            title: "Configure",
            description: "Set units and billing options",
            content: (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="units">Number of Units</Label>
                        <Input
                            id="units"
                            type="number"
                            min={1}
                            value={provisionForm.units}
                            onChange={(e) =>
                                setProvisionForm((prev) => ({
                                    ...prev,
                                    units: parseInt(e.target.value) || 1,
                                }))
                            }
                        />
                        <p className="text-sm text-muted-foreground">
                            How many units of this service to provision
                        </p>
                    </div>

                    {selectedService?.recurringPrice && (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable Recurring Billing</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Bill client on a recurring basis
                                    </p>
                                </div>
                                <Switch
                                    checked={provisionForm.enableRecurring}
                                    onCheckedChange={(checked) =>
                                        setProvisionForm((prev) => ({
                                            ...prev,
                                            enableRecurring: checked,
                                        }))
                                    }
                                />
                            </div>

                            {provisionForm.enableRecurring && (
                                <div className="space-y-2">
                                    <Label htmlFor="customPrice">Custom Recurring Price (optional)</Label>
                                    <Input
                                        id="customPrice"
                                        type="number"
                                        step="0.01"
                                        placeholder={`Default: $${selectedService.recurringPricePerUnit
                                            ? selectedService.recurringPrice * provisionForm.units
                                            : selectedService.recurringPrice
                                            }`}
                                        value={provisionForm.customRecurringPrice}
                                        onChange={(e) =>
                                            setProvisionForm((prev) => ({
                                                ...prev,
                                                customRecurringPrice: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            ),
            isValid: provisionForm.units > 0,
        },
        {
            title: "Review",
            description: "Confirm service provisioning",
            content: (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Provisioning Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Client</span>
                                <span className="font-medium">{client.name || client.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Service</span>
                                <span className="font-medium">{selectedService?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Units</span>
                                <span className="font-medium">{provisionForm.units}</span>
                            </div>
                            <hr />
                            {prices.oneOff > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">One-time Fee</span>
                                    <span className="font-medium">${prices.oneOff.toFixed(2)}</span>
                                </div>
                            )}
                            {provisionForm.enableRecurring && prices.recurring > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Recurring</span>
                                    <span className="font-medium">
                                        ${prices.recurring.toFixed(2)} / {selectedService?.billingCycleDays} days
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/ultimate/clients")}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{client.name || "Unnamed Client"}</h1>
                    <p className="text-muted-foreground">{client.email}</p>
                </div>
                <Dialog open={provisionDialogOpen} onOpenChange={(open) => {
                    setProvisionDialogOpen(open);
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
                            Add Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Provision Service</DialogTitle>
                            <DialogDescription>
                                Add a service for {client.name || client.email}
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
                                    onClick={handleProvisionService}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                        />
                                    ) : null}
                                    {isSubmitting ? "Provisioning..." : "Provision Service"}
                                </Button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Client Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{client.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{client.name || "Not set"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Active Services</p>
                        <p className="font-medium">
                            {client.clientServices.filter((s) => s.status === "ACTIVE").length}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Services */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Services</h2>
                {client.clientServices.length === 0 ? (
                    <Card className="py-8 text-center">
                        <p className="text-muted-foreground">No services provisioned yet</p>
                        <Button
                            className="mt-4"
                            onClick={() => setProvisionDialogOpen(true)}
                        >
                            Add First Service
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {client.clientServices.map((service) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">
                                                {service.serviceDefinition.name}
                                            </CardTitle>
                                            <Badge
                                                variant={
                                                    service.status === "ACTIVE"
                                                        ? "default"
                                                        : service.status === "PAUSED"
                                                            ? "secondary"
                                                            : "destructive"
                                                }
                                            >
                                                {service.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Units</p>
                                                <p className="font-medium">{service.units}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">One-time Paid</p>
                                                <p className="font-medium">
                                                    {service.oneOffPricePaid ? (
                                                        <span className="text-green-500">Yes</span>
                                                    ) : (
                                                        <span className="text-yellow-500">No</span>
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Recurring</p>
                                                <p className="font-medium">
                                                    {service.enableRecurring ? (
                                                        <>
                                                            ${service.customRecurringPrice || service.serviceDefinition.recurringPrice || 0}
                                                            <span className="text-muted-foreground"> /{service.serviceDefinition.billingCycleDays}d</span>
                                                        </>
                                                    ) : (
                                                        "Disabled"
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Next Billing</p>
                                                <p className="font-medium">
                                                    {service.nextBillingDate
                                                        ? new Date(service.nextBillingDate).toLocaleDateString()
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            {!service.oneOffPricePaid && service.serviceDefinition.oneOffPrice && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleServiceAction(service.id, "mark-paid")}
                                                >
                                                    Mark Paid
                                                </Button>
                                            )}
                                            {service.status === "ACTIVE" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleServiceAction(service.id, "pause")}
                                                >
                                                    Pause
                                                </Button>
                                            )}
                                            {service.status === "PAUSED" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleServiceAction(service.id, "resume")}
                                                >
                                                    Resume
                                                </Button>
                                            )}
                                            {service.status !== "CANCELLED" && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleServiceAction(service.id, "cancel")}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
