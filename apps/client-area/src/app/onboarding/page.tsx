"use client";

import { useState, useRef } from "react";
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
    Camera,
    Image as ImageIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

const slideInRight = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
};

const scaleIn = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

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
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

    // Profile picture
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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

    const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB");
            return;
        }

        setIsUploadingPicture(true);
        setUploadProgress(0);
        setError("");

        try {
            // Simulate upload progress for better UX
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 100);

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result as string);
                clearInterval(progressInterval);
                setUploadProgress(100);
                setTimeout(() => {
                    setIsUploadingPicture(false);
                    setUploadProgress(0);
                }, 500);
            };
            reader.readAsDataURL(file);

            // TODO: In production, upload to server here
            // const formData = new FormData();
            // formData.append('file', file);
            // await fetch(`${API_URL}/users/avatar`, { method: 'POST', body: formData });
        } catch (err) {
            setError("Failed to upload image");
            setIsUploadingPicture(false);
            setUploadProgress(0);
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setDirection(1);
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setDirection(-1);
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

    // Animation variants based on direction
    const slideVariants = {
        initial: { opacity: 0, x: direction * 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -direction * 30 },
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-6"
                    >
                        <motion.div
                            className="space-y-4"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            {/* Profile Picture Upload */}
                            <motion.div
                                variants={fadeInUp}
                                className="flex flex-col items-center gap-4 pb-4"
                            >
                                <div className="relative">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`w-24 h-24 rounded-full overflow-hidden border-4 border-dashed ${profilePicture ? "border-primary" : "border-gray-300"
                                            } cursor-pointer flex items-center justify-center bg-gray-50 relative`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {isUploadingPicture ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80">
                                                <Spinner className="w-8 h-8 text-primary animate-spin mb-1" />
                                                <span className="text-xs text-primary font-medium">{uploadProgress}%</span>
                                            </div>
                                        ) : profilePicture ? (
                                            <Image
                                                src={profilePicture}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                                                <span className="text-xs text-gray-400">Add Photo</span>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Upload progress ring */}
                                    {isUploadingPicture && (
                                        <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)]" viewBox="0 0 100 100">
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="#e5e7eb"
                                                strokeWidth="4"
                                            />
                                            <motion.circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                className="text-primary"
                                                strokeDasharray={283}
                                                strokeDashoffset={283 - (283 * uploadProgress) / 100}
                                                transform="rotate(-90 50 50)"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleProfilePictureChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Click to upload a profile picture (optional)
                                </p>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-12"
                                />
                            </motion.div>

                            <motion.div variants={fadeInUp} className="space-y-2">
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
                            </motion.div>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="flex justify-end pt-4"
                        >
                            <Button
                                onClick={handleNext}
                                disabled={!canProceedStep1}
                                className="gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        key="step2"
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-6"
                    >
                        <motion.div
                            className="space-y-4"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            <motion.p variants={fadeInUp} className="text-sm text-muted-foreground">
                                Add a payment method now to make future payments easier. You can skip this step and add one later.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3">
                                {[
                                    { type: "none" as const, icon: ArrowRight, label: "Skip" },
                                    { type: "card" as const, icon: CreditCard, label: "Card" },
                                    { type: "mobile" as const, icon: DeviceMobile, label: "Mobile" },
                                ].map((option) => (
                                    <motion.button
                                        key={option.type}
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPaymentType(option.type)}
                                        className={`p-4 rounded-lg border-2 transition-all ${paymentType === option.type
                                                ? "border-primary bg-primary/5"
                                                : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="text-center space-y-2">
                                            <option.icon className="w-6 h-6 mx-auto text-muted-foreground" />
                                            <p className="text-sm font-medium">{option.label}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>

                            <AnimatePresence mode="wait">
                                {paymentType === "card" && (
                                    <motion.div
                                        key="card-form"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 pt-4 border-t overflow-hidden"
                                    >
                                        <motion.div
                                            className="space-y-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.15 }}
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
                                    </motion.div>
                                )}

                                {paymentType === "mobile" && (
                                    <motion.div
                                        key="mobile-form"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 pt-4 border-t overflow-hidden"
                                    >
                                        <motion.div
                                            className="space-y-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.15 }}
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="flex justify-between pt-4"
                        >
                            <Button variant="outline" onClick={handleBack} className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <Button onClick={handleNext} className="gap-2">
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        key="step3"
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-6"
                    >
                        <div className="text-center py-8">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <Confetti className="w-10 h-10 text-green-600" weight="duotone" />
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl font-semibold mb-2"
                            >
                                You're all set!
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-muted-foreground"
                            >
                                Your account is ready. Start exploring your dashboard, request projects, or browse the marketplace.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="mt-6 p-4 bg-gray-50 rounded-lg text-left"
                            >
                                <h4 className="font-medium mb-2">Quick Summary</h4>
                                <div className="space-y-2 text-sm">
                                    {profilePicture && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 }}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                                            <span>Profile picture uploaded</span>
                                        </motion.div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.75 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                                        <span>Name: {name || "Not provided"}</span>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                                        <span>Phone: {phoneNumber || "Not provided"}</span>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.85 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                                        <span>
                                            Payment:{" "}
                                            {paymentType === "none"
                                                ? "Skipped"
                                                : paymentType === "card"
                                                    ? `${cardBrand} ending in ${cardLast4}`
                                                    : `${mobileProvider} - ${mobileNumber}`}
                                        </span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="flex justify-between pt-4"
                        >
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
                        </motion.div>
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
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="shadow-lg border-0">
                        <CardHeader className="text-center pb-4">
                            <motion.div
                                key={`title-${currentStep}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <CardTitle className="text-2xl">
                                    {steps[currentStep - 1]?.title}
                                </CardTitle>
                                <CardDescription>
                                    {steps[currentStep - 1]?.description}
                                </CardDescription>
                            </motion.div>
                        </CardHeader>
                        <CardContent>
                            <AnimatePresence mode="wait">
                                {renderStepContent()}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-sm text-muted-foreground mt-6"
                >
                    Welcome to Christus Veritas Technologies
                </motion.p>
            </motion.div>
        </div>
    );
}
