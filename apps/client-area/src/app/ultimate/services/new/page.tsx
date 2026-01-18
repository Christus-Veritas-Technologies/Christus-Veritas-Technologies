"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PageContainer } from "@/components/page-container";
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react";
import { toast } from "sonner";
import { apiClientWithAuth } from "@/lib/api-client";

interface CreateServiceForm {
    name: string;
    description: string;
    oneOffPrice: string;
    recurringPrice: string;
    recurringPricePerUnit: boolean;
    billingCycleDays: string;
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

export default function NewServicePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<CreateServiceForm>({
        name: "",
        description: "",
        oneOffPrice: "",
        recurringPrice: "",
        recurringPricePerUnit: false,
        billingCycleDays: "30",
    });

    const nextStep = () => {
        setDirection(1);
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
        setDirection(-1);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await apiClientWithAuth("/services/definitions", {
                method: "POST",
                body: {
                    name: form.name,
                    description: form.description || null,
                    oneOffPrice: form.oneOffPrice ? parseFloat(form.oneOffPrice) : null,
                    recurringPrice: form.recurringPrice ? parseFloat(form.recurringPrice) : null,
                    recurringPricePerUnit: form.recurringPricePerUnit,
                    billingCycleDays: parseInt(form.billingCycleDays),
                },
            });

            if (response.ok) {
                toast.success("Service created successfully!");
                router.push("/ultimate/services");
            } else {
                toast.error(response.error || "Failed to create service");
            }
        } catch (error) {
            console.error("Failed to create service:", error);
            toast.error("An error occurred while creating the service");
        } finally {
            setIsSubmitting(false);
        }
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
                            placeholder="e.g., Website Development"
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe what this service includes..."
                            rows={4}
                            value={form.description}
                            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Pricing",
            description: "Set up pricing structure",
            content: (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="oneOffPrice">One-Time Fee ($)</Label>
                        <Input
                            id="oneOffPrice"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={form.oneOffPrice}
                            onChange={(e) => setForm((prev) => ({ ...prev, oneOffPrice: e.target.value }))}
                        />
                        <p className="text-xs text-muted-foreground">
                            Initial setup or one-time charge
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="recurringPrice">Recurring Price ($)</Label>
                        <Input
                            id="recurringPrice"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={form.recurringPrice}
                            onChange={(e) => setForm((prev) => ({ ...prev, recurringPrice: e.target.value }))}
                        />
                        <p className="text-xs text-muted-foreground">
                            Regular billing amount
                        </p>
                    </div>
                    <div className="flex items-center justify-between space-x-2 p-3 bg-muted rounded-lg">
                        <div className="space-y-0.5">
                            <Label htmlFor="perUnit">Price Per Unit</Label>
                            <p className="text-xs text-muted-foreground">
                                Multiply price by number of units
                            </p>
                        </div>
                        <Switch
                            id="perUnit"
                            checked={form.recurringPricePerUnit}
                            onCheckedChange={(checked) =>
                                setForm((prev) => ({ ...prev, recurringPricePerUnit: checked }))
                            }
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Billing Cycle",
            description: "Configure recurring billing",
            content: (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="billingCycleDays">Billing Cycle (Days)</Label>
                        <Input
                            id="billingCycleDays"
                            type="number"
                            value={form.billingCycleDays}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, billingCycleDays: e.target.value }))
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            How often clients are billed (e.g., 30 for monthly, 365 for yearly)
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="mt-6 p-4 bg-muted rounded-lg space-y-3">
                        <h4 className="font-medium">Service Summary</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Service:</span>
                                <span className="font-medium">{form.name || "Not set"}</span>
                            </div>
                            {form.oneOffPrice && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Setup Fee:</span>
                                    <span className="font-medium">${form.oneOffPrice}</span>
                                </div>
                            )}
                            {form.recurringPrice && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Recurring:</span>
                                    <span className="font-medium">
                                        ${form.recurringPrice}
                                        {form.recurringPricePerUnit && "/unit"}
                                        {" "}every {form.billingCycleDays} days
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    const canProceed = () => {
        if (currentStep === 0) {
            return form.name.trim().length > 0;
        }
        if (currentStep === 1) {
            return true; // Pricing is optional
        }
        return true;
    };

    return (
        <PageContainer>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/ultimate/services")}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Service</h1>
                        <p className="text-gray-500 mt-1">
                            Set up a new service offering for your clients
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        {/* Step Progress */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-center">
                                    <motion.div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStep
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                            }`}
                                        animate={{
                                            scale: index === currentStep ? 1.1 : 1,
                                        }}
                                    >
                                        {index < currentStep ? (
                                            <Check className="w-5 h-5" weight="bold" />
                                        ) : (
                                            index + 1
                                        )}
                                    </motion.div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-16 h-0.5 mx-2 ${index < currentStep ? "bg-primary" : "bg-muted"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <CardTitle>{steps[currentStep].title}</CardTitle>
                        <CardDescription>{steps[currentStep].description}</CardDescription>
                    </CardHeader>

                    <CardContent>
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
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 },
                                    }}
                                >
                                    {steps[currentStep].content}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            {currentStep < steps.length - 1 ? (
                                <Button onClick={nextStep} disabled={!canProceed()} className="gap-2">
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || isSubmitting}
                                    className="gap-2"
                                >
                                    {isSubmitting ? "Creating..." : "Create Service"}
                                    {!isSubmitting && <Check className="w-4 h-4" weight="bold" />}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
