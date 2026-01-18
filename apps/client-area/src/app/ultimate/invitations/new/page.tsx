"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { ArrowLeft, ArrowRight, Check, EnvelopeSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import { apiClientWithAuth } from "@/lib/api-client";

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

export default function NewInvitationPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serviceDefinitions, setServiceDefinitions] = useState<ServiceDefinition[]>([]);
    const [inviteForm, setInviteForm] = useState<InviteFormData>({
        email: "",
        name: "",
        role: "CLIENT",
        provisionService: false,
        serviceDefinitionId: "",
        units: 1,
        enableRecurring: true,
    });

    const fetchServiceDefinitions = async () => {
        try {
            const response = await apiClientWithAuth<ServiceDefinition[]>("/services/definitions");

            if (response.ok && response.data) {
                setServiceDefinitions(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch service definitions:", error);
        }
    };

    useEffect(() => {
        fetchServiceDefinitions();
    }, []);

    const nextStep = () => {
        setDirection(1);
        setCurrentStep((prev) => Math.min(prev + 1, getSteps().length - 1));
    };

    const prevStep = () => {
        setDirection(-1);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSendInvitation = async () => {
        setIsSubmitting(true);
        try {
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

            const response = await apiClientWithAuth("/invitations", {
                method: "POST",
                body,
            });

            if (response.ok) {
                toast.success("Invitation sent successfully!");
                router.push("/ultimate/invitations");
            } else {
                toast.error(response.error || "Failed to send invitation");
            }
        } catch (error) {
            console.error("Failed to send invitation:", error);
            toast.error("An error occurred while sending the invitation");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedService = serviceDefinitions.find(
        (s) => s.id === inviteForm.serviceDefinitionId
    );

    const getSteps = () => {
        const baseSteps = [
            {
                title: "User details",
                description: "Basic information",
                content: (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-normal text-gray-700">Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                value={inviteForm.name}
                                onChange={(e) =>
                                    setInviteForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-normal text-gray-700">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={inviteForm.email}
                                onChange={(e) =>
                                    setInviteForm((prev) => ({ ...prev, email: e.target.value }))
                                }
                                className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-700">Role</Label>
                            <Select
                                value={inviteForm.role}
                                onValueChange={(value: "ADMIN" | "CLIENT") =>
                                    setInviteForm((prev) => ({ ...prev, role: value, provisionService: false }))
                                }
                            >
                                <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CLIENT">Client</SelectItem>
                                    <SelectItem value="ADMIN">Admin (CVT Staff)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-400">
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
                title: "Service",
                description: "Assign services",
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
            title: "Confirmation",
            description: "Review and send",
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
                        The user will receive an email with their invitation link.
                    </p>
                </div>
            ),
            isValid: true,
        });

        return baseSteps;
    };

    const steps = getSteps();
    const currentStepData = steps[currentStep];

    return (
        <PageContainer>
            <div className="min-h-screen flex items-center justify-center py-12 px-4">
                <Card className="w-full max-w-2xl shadow-lg border-gray-200">
                    <CardContent className="p-8">
                        {/* Step Progress */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-8">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center flex-1 relative">
                                        {/* Step indicator */}
                                        <div className="flex items-center w-full">
                                            {index > 0 && (
                                                <div
                                                    className={`flex-1 h-0.5 transition-colors ${index <= currentStep ? "bg-blue-500" : "bg-gray-300"
                                                        }`}
                                                />
                                            )}
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10 ${index === currentStep
                                                        ? "bg-blue-500 text-white"
                                                        : index < currentStep
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-gray-300 text-gray-600"
                                                    }`}
                                            >
                                                {index < currentStep ? (
                                                    <Check className="w-5 h-5" weight="bold" />
                                                ) : (
                                                    <div className="w-3 h-3 rounded-full bg-current" />
                                                )}
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div
                                                    className={`flex-1 h-0.5 transition-colors ${index < currentStep ? "bg-blue-500" : "bg-gray-300"
                                                        }`}
                                                />
                                            )}
                                        </div>
                                        {/* Step label */}
                                        <div className="text-center mt-2 absolute top-12">
                                            <p
                                                className={`text-sm font-medium whitespace-nowrap ${index === currentStep
                                                        ? "text-blue-600"
                                                        : index < currentStep
                                                            ? "text-blue-600"
                                                            : "text-gray-500"
                                                    }`}
                                            >
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="mt-24 mb-8 min-h-85">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 },
                                    }}
                                >
                                    {currentStepData.content}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-end">
                            {currentStep < steps.length - 1 ? (
                                <Button
                                    onClick={nextStep}
                                    disabled={!currentStepData.isValid}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg h-11"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4 ml-2" weight="bold" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSendInvitation}
                                    disabled={!currentStepData.isValid || isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg h-11"
                                >
                                    {isSubmitting ? "Sending..." : "Send Invitation"}
                                    {!isSubmitting && <EnvelopeSimple className="w-4 h-4 ml-2" weight="fill" />}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
