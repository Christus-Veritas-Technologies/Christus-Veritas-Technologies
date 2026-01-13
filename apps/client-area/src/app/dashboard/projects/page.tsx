"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Briefcase,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    Warning,
    HourglassSimple,
    Spinner,
    ArrowRight,
    CurrencyDollar,
} from "@phosphor-icons/react";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
    description: string;
    requirements?: string;
    timeline?: string;
    budget?: number;
    quotedPrice?: number;
    quotedTimeline?: string;
    quoteNotes?: string;
    quotedAt?: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
}

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

const getStatusBadge = (status: string) => {
    switch (status) {
        case "PENDING":
            return (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1">
                    <Clock weight="fill" className="w-3 h-3" />
                    Pending Review
                </Badge>
            );
        case "QUOTED":
            return (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1">
                    <CurrencyDollar weight="fill" className="w-3 h-3" />
                    Quote Ready
                </Badge>
            );
        case "ACCEPTED":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Accepted
                </Badge>
            );
        case "DECLINED":
            return (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
                    <XCircle weight="fill" className="w-3 h-3" />
                    Declined
                </Badge>
            );
        case "IN_PROGRESS":
            return (
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 gap-1">
                    <Spinner weight="fill" className="w-3 h-3" />
                    In Progress
                </Badge>
            );
        case "ON_HOLD":
            return (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1">
                    <HourglassSimple weight="fill" className="w-3 h-3" />
                    On Hold
                </Badge>
            );
        case "COMPLETED":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Completed
                </Badge>
            );
        case "CANCELLED":
            return (
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 gap-1">
                    <XCircle weight="fill" className="w-3 h-3" />
                    Cancelled
                </Badge>
            );
        default:
            return (
                <Badge variant="secondary" className="gap-1">
                    {status}
                </Badge>
            );
    }
};

const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100);
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const [timeline, setTimeline] = useState("");
    const [budget, setBudget] = useState("");

    const fetchProjects = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/projects/my-projects`,
                { credentials: 'include' }
            );
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/projects/request`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        title,
                        description,
                        requirements: requirements || undefined,
                        timeline: timeline || undefined,
                        budget: budget ? parseInt(budget) * 100 : undefined,
                    }),
                }
            );

            if (response.ok) {
                setIsDialogOpen(false);
                setTitle("");
                setDescription("");
                setRequirements("");
                setTimeline("");
                setBudget("");
                fetchProjects();
            }
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeProjects = projects.filter(p => 
        ['PENDING', 'QUOTED', 'ACCEPTED', 'IN_PROGRESS', 'ON_HOLD'].includes(p.status)
    );
    const completedProjects = projects.filter(p => p.status === 'COMPLETED');
    const otherProjects = projects.filter(p => 
        ['DECLINED', 'CANCELLED'].includes(p.status)
    );

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-muted-foreground">
                        Request custom software development projects
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus weight="bold" className="w-4 h-4" />
                            Request Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>Request a New Project</DialogTitle>
                                <DialogDescription>
                                    Tell us about your project and we&apos;ll get back to you with a quote.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Project Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., E-commerce Website"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        minLength={5}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe what you need built..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        minLength={20}
                                        rows={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="requirements">Technical Requirements (Optional)</Label>
                                    <Textarea
                                        id="requirements"
                                        placeholder="Any specific technologies, integrations, or features..."
                                        value={requirements}
                                        onChange={(e) => setRequirements(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="timeline">Desired Timeline</Label>
                                        <Input
                                            id="timeline"
                                            placeholder="e.g., 2 months"
                                            value={timeline}
                                            onChange={(e) => setTimeline(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="budget">Estimated Budget (USD)</Label>
                                        <Input
                                            id="budget"
                                            type="number"
                                            placeholder="e.g., 5000"
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Submit Request"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Briefcase weight="duotone" className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{projects.length}</p>
                                <p className="text-xs text-muted-foreground">Total Projects</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Spinner weight="duotone" className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{activeProjects.length}</p>
                                <p className="text-xs text-muted-foreground">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <CheckCircle weight="duotone" className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{completedProjects.length}</p>
                                <p className="text-xs text-muted-foreground">Completed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <Clock weight="duotone" className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {projects.filter(p => p.status === 'QUOTED').length}
                                </p>
                                <p className="text-xs text-muted-foreground">Awaiting Response</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Loading State */}
            {isLoading ? (
                <motion.div variants={itemVariants} className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </motion.div>
            ) : projects.length === 0 ? (
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Briefcase weight="duotone" className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Request your first custom software project and we&apos;ll provide a quote.
                            </p>
                            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                                <Plus weight="bold" className="w-4 h-4" />
                                Request Project
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <>
                    {/* Active Projects */}
                    {activeProjects.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Active Projects</CardTitle>
                                    <CardDescription>
                                        Projects that are pending, quoted, or in progress
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {activeProjects.map((project) => (
                                            <div
                                                key={project.id}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="font-medium truncate">{project.title}</h4>
                                                        {getStatusBadge(project.status)}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {project.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                                                        {project.quotedPrice && (
                                                            <span className="font-medium text-primary">
                                                                Quote: {formatCurrency(project.quotedPrice)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/dashboard/projects/${project.id}`}>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Completed Projects */}
                    {completedProjects.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Completed Projects</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {completedProjects.map((project) => (
                                            <div
                                                key={project.id}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="font-medium truncate">{project.title}</h4>
                                                        {getStatusBadge(project.status)}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {project.description}
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/dashboard/projects/${project.id}`}>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Declined/Cancelled Projects */}
                    {otherProjects.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-muted-foreground">Closed Projects</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {otherProjects.map((project) => (
                                            <div
                                                key={project.id}
                                                className="flex items-center justify-between p-4 border rounded-lg opacity-60"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="font-medium truncate">{project.title}</h4>
                                                        {getStatusBadge(project.status)}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {project.description}
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/dashboard/projects/${project.id}`}>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </>
            )}
        </motion.div>
    );
}
