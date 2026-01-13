"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    Globe,
    ShieldCheck,
    Cloud,
    ArrowRight,
    CalendarBlank,
} from "@phosphor-icons/react";

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

// Mock data - replace with real API calls
const services = [
    {
        id: 1,
        name: "Professional Web Hosting",
        description: "High-performance hosting for your business website",
        icon: Globe,
        status: "ACTIVE",
        renewalDate: "Feb 15, 2026",
        price: "$29.99/month",
    },
    {
        id: 2,
        name: "SSL Certificate",
        description: "Wildcard SSL for all subdomains",
        icon: ShieldCheck,
        status: "ACTIVE",
        renewalDate: "Mar 1, 2026",
        price: "$99.99/year",
    },
    {
        id: 3,
        name: "Cloud Backup",
        description: "Automated daily backups with 30-day retention",
        icon: Cloud,
        status: "ACTIVE",
        renewalDate: "Jan 30, 2026",
        price: "$19.99/month",
    },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case "ACTIVE":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
        case "SUSPENDED":
            return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Suspended</Badge>;
        case "CANCELLED":
            return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function ServicesPage() {
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
                    <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and view all your active services
                    </p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    <Package weight="bold" className="w-4 h-4 mr-2" />
                    Request New Service
                </Button>
            </motion.div>

            {/* Services Grid */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <Card key={service.id} className="group hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <service.icon weight="duotone" className="w-6 h-6 text-primary" />
                                </div>
                                {getStatusBadge(service.status)}
                            </div>
                            <CardTitle className="mt-4">{service.name}</CardTitle>
                            <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <CalendarBlank weight="regular" className="w-4 h-4" />
                                        Renews
                                    </span>
                                    <span className="font-medium">{service.renewalDate}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Price</span>
                                    <span className="font-medium text-primary">{service.price}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-2 group-hover:border-primary"
                                >
                                    View Details
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            {/* Empty State - shown when no services */}
            {services.length === 0 && (
                <motion.div variants={itemVariants}>
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Package weight="duotone" className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Services Yet</h3>
                            <p className="text-muted-foreground mb-4">
                                You don&apos;t have any active services. Get started by requesting a new service.
                            </p>
                            <Button className="bg-primary hover:bg-primary/90">
                                Request New Service
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
}
