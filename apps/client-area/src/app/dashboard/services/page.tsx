"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Package,
    Desktop,
    CheckCircle,
    Warning,
    XCircle,
    Barcode,
    Receipt,
    Info,
    ArrowRight,
    Cpu,
    WifiHigh,
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
const serviceOverview = {
    serviceName: "CVT POS System",
    serviceStatus: "ACTIVE" as const,
    activeSince: "January 1, 2024",
    monthlyFee: 299.99,
    nextBillingDate: "February 1, 2026",
    contractEndDate: "December 31, 2026",
};

const terminals = [
    {
        id: "term_001",
        name: "Main Counter Terminal",
        serialNumber: "CVT-POS-2024-001A",
        model: "CVT Terminal Pro",
        status: "ONLINE" as const,
        lastSeen: "2 minutes ago",
        softwareVersion: "v2.5.3",
    },
    {
        id: "term_002",
        name: "Backup Terminal",
        serialNumber: "CVT-POS-2024-002B",
        model: "CVT Terminal Pro",
        status: "ONLINE" as const,
        lastSeen: "5 minutes ago",
        softwareVersion: "v2.5.3",
    },
    {
        id: "term_003",
        name: "Portable Terminal",
        serialNumber: "CVT-POS-2024-003C",
        model: "CVT Terminal Lite",
        status: "OFFLINE" as const,
        lastSeen: "2 days ago",
        softwareVersion: "v2.5.1",
    },
];

const hardware = [
    {
        id: "hw_001",
        type: "Barcode Scanner",
        model: "CVT Scanner S200",
        serialNumber: "CVT-SC-2024-001",
        assignedTo: "Main Counter Terminal",
        status: "ACTIVE" as const,
    },
    {
        id: "hw_002",
        type: "Receipt Printer",
        model: "CVT Printer T80",
        serialNumber: "CVT-PT-2024-001",
        assignedTo: "Main Counter Terminal",
        status: "ACTIVE" as const,
    },
    {
        id: "hw_003",
        type: "Receipt Printer",
        model: "CVT Printer T80",
        serialNumber: "CVT-PT-2024-002",
        assignedTo: "Backup Terminal",
        status: "ACTIVE" as const,
    },
];

const getServiceStatusBadge = (status: "ACTIVE" | "SUSPENDED" | "CANCELLED") => {
    switch (status) {
        case "ACTIVE":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Active
                </Badge>
            );
        case "SUSPENDED":
            return (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
                    <Warning weight="fill" className="w-3 h-3" />
                    Suspended
                </Badge>
            );
        case "CANCELLED":
            return (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
                    <XCircle weight="fill" className="w-3 h-3" />
                    Cancelled
                </Badge>
            );
    }
};

const getTerminalStatusBadge = (status: "ONLINE" | "OFFLINE") => {
    switch (status) {
        case "ONLINE":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <WifiHigh weight="fill" className="w-3 h-3" />
                    Online
                </Badge>
            );
        case "OFFLINE":
            return (
                <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 gap-1">
                    <XCircle weight="fill" className="w-3 h-3" />
                    Offline
                </Badge>
            );
    }
};

const getHardwareStatusBadge = (status: "ACTIVE" | "INACTIVE") => {
    switch (status) {
        case "ACTIVE":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Active
                </Badge>
            );
        case "INACTIVE":
            return (
                <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 gap-1">
                    <XCircle weight="fill" className="w-3 h-3" />
                    Inactive
                </Badge>
            );
    }
};

export default function ServicesPage() {
    const onlineTerminals = terminals.filter(t => t.status === "ONLINE").length;
    const totalTerminals = terminals.length;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                <p className="text-muted-foreground mt-1">
                    View your POS service details and assigned hardware
                </p>
            </motion.div>

            {/* Service Overview */}
            <motion.div variants={itemVariants}>
                <Card className="border-primary/20">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Desktop weight="duotone" className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{serviceOverview.serviceName}</CardTitle>
                                    <CardDescription>
                                        Active since {serviceOverview.activeSince}
                                    </CardDescription>
                                </div>
                            </div>
                            {getServiceStatusBadge(serviceOverview.serviceStatus)}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Monthly Fee</p>
                                <p className="text-xl font-bold">${serviceOverview.monthlyFee.toFixed(2)}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Next Billing</p>
                                <p className="text-lg font-semibold">{serviceOverview.nextBillingDate}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Contract End</p>
                                <p className="text-lg font-semibold">{serviceOverview.contractEndDate}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Terminals</p>
                                <p className="text-lg font-semibold">
                                    <span className="text-green-600">{onlineTerminals}</span>
                                    <span className="text-muted-foreground">/{totalTerminals} online</span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Terminals */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Cpu weight="duotone" className="w-5 h-5 text-primary" />
                            <CardTitle>POS Terminals</CardTitle>
                        </div>
                        <CardDescription>
                            Your assigned POS terminals and their current status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Serial Number</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Seen</TableHead>
                                    <TableHead>Software</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {terminals.map((terminal) => (
                                    <TableRow key={terminal.id}>
                                        <TableCell className="font-medium">{terminal.name}</TableCell>
                                        <TableCell>
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                {terminal.serialNumber}
                                            </code>
                                        </TableCell>
                                        <TableCell>{terminal.model}</TableCell>
                                        <TableCell>{getTerminalStatusBadge(terminal.status)}</TableCell>
                                        <TableCell className="text-muted-foreground">{terminal.lastSeen}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{terminal.softwareVersion}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Hardware */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Package weight="duotone" className="w-5 h-5 text-secondary" />
                            <CardTitle>Assigned Hardware</CardTitle>
                        </div>
                        <CardDescription>
                            Peripherals and hardware assigned to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Serial Number</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hardware.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {item.type === "Barcode Scanner" ? (
                                                    <Barcode weight="duotone" className="w-4 h-4 text-muted-foreground" />
                                                ) : (
                                                    <Receipt weight="duotone" className="w-4 h-4 text-muted-foreground" />
                                                )}
                                                {item.type}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{item.model}</TableCell>
                                        <TableCell>
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                {item.serialNumber}
                                            </code>
                                        </TableCell>
                                        <TableCell>{item.assignedTo}</TableCell>
                                        <TableCell>{getHardwareStatusBadge(item.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Support Info */}
            <motion.div variants={itemVariants}>
                <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <Info weight="duotone" className="w-8 h-8 text-blue-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    If you&apos;re experiencing issues with your POS terminals or need hardware 
                                    maintenance, our support team is here to help.
                                </p>
                                <Button variant="outline" className="gap-2">
                                    Contact Support
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
