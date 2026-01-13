"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Service {
    id: string;
    name: string;
    description: string;
    type: "one_time" | "recurring" | "usage_based";
    price: number;
    currency: string;
    billingCycle?: "monthly" | "yearly" | "quarterly";
    status: "active" | "inactive" | "draft";
    subscriberCount: number;
    createdAt: Date;
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

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        name: "",
        description: "",
        type: "recurring" as Service["type"],
        price: "",
        currency: "USD",
        billingCycle: "monthly" as Service["billingCycle"],
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        // Mock data for now
        setTimeout(() => {
            setServices([
                {
                    id: "1",
                    name: "SEO Optimization Pro",
                    description: "Complete SEO package with monthly reports and keyword tracking",
                    type: "recurring",
                    price: 299,
                    currency: "USD",
                    billingCycle: "monthly",
                    status: "active",
                    subscriberCount: 45,
                    createdAt: new Date("2024-01-15"),
                },
                {
                    id: "2",
                    name: "Website Development",
                    description: "Custom website development with responsive design",
                    type: "one_time",
                    price: 2500,
                    currency: "USD",
                    status: "active",
                    subscriberCount: 23,
                    createdAt: new Date("2024-02-01"),
                },
                {
                    id: "3",
                    name: "Cloud Hosting",
                    description: "Scalable cloud hosting with 99.9% uptime guarantee",
                    type: "usage_based",
                    price: 0.05,
                    currency: "USD",
                    status: "active",
                    subscriberCount: 78,
                    createdAt: new Date("2024-01-01"),
                },
                {
                    id: "4",
                    name: "Social Media Management",
                    description: "Full social media management across all platforms",
                    type: "recurring",
                    price: 499,
                    currency: "USD",
                    billingCycle: "monthly",
                    status: "active",
                    subscriberCount: 32,
                    createdAt: new Date("2024-03-10"),
                },
                {
                    id: "5",
                    name: "Email Marketing Suite",
                    description: "Comprehensive email marketing with automation",
                    type: "recurring",
                    price: 199,
                    currency: "USD",
                    billingCycle: "monthly",
                    status: "draft",
                    subscriberCount: 0,
                    createdAt: new Date("2024-06-01"),
                },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleCreateService = async () => {
        setIsCreating(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setServices((prev) => [
            ...prev,
            {
                id: String(prev.length + 1),
                name: createForm.name,
                description: createForm.description,
                type: createForm.type,
                price: parseFloat(createForm.price) || 0,
                currency: createForm.currency,
                billingCycle: createForm.type === "recurring" ? createForm.billingCycle : undefined,
                status: "draft",
                subscriberCount: 0,
                createdAt: new Date(),
            },
        ]);
        setCreateForm({
            name: "",
            description: "",
            type: "recurring",
            price: "",
            currency: "USD",
            billingCycle: "monthly",
        });
        setCreateDialogOpen(false);
        setIsCreating(false);
    };

    const toggleServiceStatus = (serviceId: string) => {
        setServices((prev) =>
            prev.map((service) =>
                service.id === serviceId
                    ? { ...service, status: service.status === "active" ? "inactive" : "active" }
                    : service
            )
        );
    };

    const totalRevenue = services
        .filter((s) => s.status === "active" && s.type === "recurring")
        .reduce((acc, s) => acc + s.price * s.subscriberCount, 0);

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-64 bg-gray-200 rounded" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-gray-200 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Services</h1>
                    <p className="text-gray-500 text-md mt-1">
                        Christus Veritas Technologies - Create and manage service offerings
                    </p>
                </div>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-premium-purple hover:bg-premium-purple/90">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Service</DialogTitle>
                            <DialogDescription>
                                Add a new service offering for your clients.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="service-name">Service Name</Label>
                                <Input
                                    id="service-name"
                                    placeholder="my awesome service"
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="service-description">Description</Label>
                                <Textarea
                                    id="service-description"
                                    placeholder="describe your service..."
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Pricing Type</Label>
                                <Select
                                    value={createForm.type}
                                    onValueChange={(value: Service["type"]) => setCreateForm({ ...createForm, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="one_time">One-Time</SelectItem>
                                        <SelectItem value="recurring">Recurring</SelectItem>
                                        <SelectItem value="usage_based">Usage-Based</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="service-price">Price</Label>
                                    <Input
                                        id="service-price"
                                        type="number"
                                        placeholder="0.00"
                                        value={createForm.price}
                                        onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Currency</Label>
                                    <Select
                                        value={createForm.currency}
                                        onValueChange={(value) => setCreateForm({ ...createForm, currency: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="ZWL">ZWL</SelectItem>
                                            <SelectItem value="ZAR">ZAR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {createForm.type === "recurring" && (
                                <div className="space-y-2">
                                    <Label>Billing Cycle</Label>
                                    <Select
                                        value={createForm.billingCycle}
                                        onValueChange={(value) => setCreateForm({ ...createForm, billingCycle: value as Service["billingCycle"] })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="quarterly">Quarterly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <Button
                                className="w-full bg-premium-purple hover:bg-premium-purple/90"
                                onClick={handleCreateService}
                                disabled={isCreating || !createForm.name || !createForm.price}
                            >
                                {isCreating ? "Creating..." : "Create Service"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Total Services</p>
                        <p className="text-2xl font-bold">{services.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Active</p>
                        <p className="text-2xl font-bold text-green-600">{services.filter((s) => s.status === "active").length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Total Subscribers</p>
                        <p className="text-2xl font-bold">{services.reduce((acc, s) => acc + s.subscriberCount, 0)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-premium-purple">${totalRevenue.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Services Grid */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{service.name}</CardTitle>
                                            <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                service.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : service.status === "draft"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}>
                                                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            service.type === "recurring"
                                                ? "bg-blue-100 text-blue-800"
                                                : service.type === "one_time"
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-orange-100 text-orange-800"
                                        }`}>
                                            {service.type.replace("_", "-")}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                                    <div className="flex items-end justify-between mb-4">
                                        <div>
                                            <span className="text-2xl font-bold text-gray-900">
                                                ${service.price}
                                            </span>
                                            {service.type === "recurring" && (
                                                <span className="text-gray-500 text-sm">/{service.billingCycle?.slice(0, 2)}</span>
                                            )}
                                            {service.type === "usage_based" && (
                                                <span className="text-gray-500 text-sm">/unit</span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-900">{service.subscriberCount}</p>
                                            <p className="text-xs text-gray-500">subscribers</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            Edit
                                        </Button>
                                        <Button
                                            variant={service.status === "active" ? "destructive" : "default"}
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => toggleServiceStatus(service.id)}
                                        >
                                            {service.status === "active" ? "Deactivate" : "Activate"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
