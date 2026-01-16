"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    User,
    Phone,
    CreditCard,
    DeviceMobile,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    Spinner,
    RocketLaunch,
    Confetti,
} from "@phosphor-icons/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface Step {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
}

const steps: Step[] = [
    {
        id: 1,
        title: "Personal Information",
        description: "Tell us a bit about yourself",
        icon: User,
    },
    {
        id: 2,
        title: "Payment Methods",
        description: "Add a payment method (optional)",
        icon: CreditCard,
    },
    {
        id: 3,
        title: "All Done!",
        description: "You're ready to get started",
        icon: RocketLaunch,
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Personal info
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // Payment method (optional)
    const [paymentType, setPaymentType] = useState<"none" | "card" | "mobile">("none");
    
    // Card details
    const [cardBrand, setCardBrand] = useState<"VISA" | "MASTERCARD">("VISA");
    const [cardLast4, setCardLast4] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardExpMonth, setCardExpMonth] = useState("");
    const [cardExpYear, setCardExpYear] = useState("");

    // Mobile money details
    const [mobileProvider, setMobileProvider] = useState<"ECOCASH" | "ONEMONEY" | "INNBUCKS">("ECOCASH");
    const [mobileNumber, setMobileNumber] = useState("");

    const [error, setError] = useState("");

    const getAuthToken = () => {
        const match = document.cookie.match(/auth_token=([^;]+)/);
        return match ? match[1] : null;
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            const token = getAuthToken();
            if (!token) {
                router.push("/auth/signin");
                return;
            }

            // Complete onboarding with profile data
            const onboardingResponse = await fetch(`${API_URL}/auth/complete-onboarding`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: name || undefined,
                    phoneNumber: phoneNumber || undefined,
                }),
            });

            if (!onboardingResponse.ok) {
                throw new Error("Failed to complete onboarding");
            }

            // Add payment method if selected
            if (paymentType === "card" && cardLast4 && cardHolderName) {
                await fetch(`${API_URL}/payment-methods/card`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        cardBrand,
                        cardLast4,
                        cardHolderName,
                        cardExpMonth: parseInt(cardExpMonth),
                        cardExpYear: parseInt(cardExpYear),
                        isDefault: true,
                    }),
                });
            } else if (paymentType === "mobile" && mobileNumber) {
                await fetch(`${API_URL}/payment-methods/mobile-money`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        mobileProvider,
                        mobileNumber,
                        isDefault: true,
                    }),
                });
            }

            // Redirect to dashboard
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceedStep1 = name.trim().length > 0;
    const canProceedStep2 = true; // Payment is optional

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number (optional)</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                        id="phone"
                                        placeholder="+263 77 123 4567"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="h-12 pl-10"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    We'll use this to contact you about your projects
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleNext}
                                disabled={!canProceedStep1}
                                className="gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Add a payment method now to make future payments easier. You can skip this step and add one later.
                            </p>

                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymentType("none")}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                        paymentType === "none"
                                            ? "border-primary bg-primary/5"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="text-center space-y-2">
                                        <ArrowRight className="w-6 h-6 mx-auto text-muted-foreground" />
                                        <p className="text-sm font-medium">Skip</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentType("card")}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                        paymentType === "card"
                                            ? "border-primary bg-primary/5"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="text-center space-y-2">
                                        <CreditCard className="w-6 h-6 mx-auto text-muted-foreground" />
                                        <p className="text-sm font-medium">Card</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentType("mobile")}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                        paymentType === "mobile"
                                            ? "border-primary bg-primary/5"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="text-center space-y-2">
                                        <DeviceMobile className="w-6 h-6 mx-auto text-muted-foreground" />
                                        <p className="text-sm font-medium">Mobile</p>
                                    </div>
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {paymentType === "card" && (
                                    <motion.div
                                        key="card-form"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 pt-4 border-t"
                                    >
                                        <div className="space-y-2">
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

                                        <div className="space-y-2">
                                            <Label>Cardholder Name</Label>
                                            <Input
                                                placeholder="John Doe"
                                                value={cardHolderName}
                                                onChange={(e) => setCardHolderName(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Last 4 Digits</Label>
                                            <Input
                                                placeholder="1234"
                                                maxLength={4}
                                                value={cardLast4}
                                                onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ""))}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
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
                                            <div className="space-y-2">
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
                                    </motion.div>
                                )}

                                {paymentType === "mobile" && (
                                    <motion.div
                                        key="mobile-form"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 pt-4 border-t"
                                    >
                                        <div className="space-y-2">
                                            <Label>Provider</Label>
                                            <Select value={mobileProvider} onValueChange={(v) => setMobileProvider(v as "ECOCASH" | "ONEMONEY" | "INNBUCKS")}>
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

                                        <div className="space-y-2">
                                            <Label>Phone Number</Label>
                                            <Input
                                                placeholder="0771234567"
                                                value={mobileNumber}
                                                onChange={(e) => setMobileNumber(e.target.value)}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Enter Zimbabwe phone number (e.g., 0771234567)
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack} className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <Button onClick={handleNext} className="gap-2">
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center py-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <Confetti className="w-10 h-10 text-green-600" weight="duotone" />
                            </motion.div>
                            
                            <h3 className="text-xl font-semibold mb-2">You're all set!</h3>
                            <p className="text-muted-foreground">
                                Your account is ready. Start exploring your dashboard, request projects, or browse the marketplace.
                            </p>

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                                <h4 className="font-medium mb-2">Quick Summary</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                                        <span>Name: {name || "Not provided"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                                        <span>Phone: {phoneNumber || "Not provided"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                                        <span>
                                            Payment:{" "}
                                            {paymentType === "none"
                                                ? "Skipped"
                                                : paymentType === "card"
                                                ? `${cardBrand} ending in ${cardLast4}`
                                                : `${mobileProvider} - ${mobileNumber}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack} className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <Button
                                onClick={handleComplete}
                                disabled={isSubmitting}
                                className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner className="w-4 h-4 animate-spin" />
                                        Setting up...
                                    </>
                                ) : (
                                    <>
                                        Go to Dashboard
                                        <RocketLaunch className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                {/* Progress indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`flex items-center ${index !== steps.length - 1 ? "flex-1" : ""}`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                        currentStep >= step.id
                                            ? "bg-primary text-white"
                                            : "bg-gray-200 text-gray-500"
                                    }`}
                                >
                                    {currentStep > step.id ? (
                                        <CheckCircle className="w-5 h-5" weight="fill" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                {index !== steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 rounded transition-colors ${
                                            currentStep > step.id ? "bg-primary" : "bg-gray-200"
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Step {currentStep} of {steps.length}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">
                            {steps[currentStep - 1]?.title}
                        </CardTitle>
                        <CardDescription>
                            {steps[currentStep - 1]?.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Welcome to Christus Veritas Technologies
                </p>
            </motion.div>
        </div>
    );
}
