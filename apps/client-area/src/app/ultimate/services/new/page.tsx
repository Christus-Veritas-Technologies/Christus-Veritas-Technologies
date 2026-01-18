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
            title: "Service details",
            description: "Basic information",
            content: (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-normal text-gray-700">Service name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Website Development"
                            className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-normal text-gray-700">About the service</Label>
                        <Textarea
                            id="description"
                            placeholder="What is this service about?"
                            rows={5}
                            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
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
                <div className="space-y-6">
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
            title: "Billing",
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
                                    {steps[currentStep].content}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-end">
                            {currentStep < steps.length - 1 ? (
                                <Button
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg h-11"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4 ml-2" weight="bold" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg h-11"
                                >
                                    {isSubmitting ? "Creating..." : "Create Service"}
                                    {!isSubmitting && <Check className="w-4 h-4 ml-2" weight="bold" />}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
