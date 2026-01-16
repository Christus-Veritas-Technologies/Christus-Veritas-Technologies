"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    XCircle,
    CurrencyDollar,
    CalendarBlank,
    User,
    ChatCircle,
    Warning,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProjectMessage {
    id: string;
    message: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        isAdmin: boolean;
    };
}

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
    userAcceptedAt?: string;
    userDeclinedAt?: string;
    declineReason?: string;
    startedAt?: string;
    completedAt?: string;
    deliverables?: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
    quotedBy?: {
        id: string;
        name: string;
    };
    messages: ProjectMessage[];
}

const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100);
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
        PENDING: { color: "bg-yellow-100 text-yellow-700", label: "Pending Review" },
        QUOTED: { color: "bg-blue-100 text-blue-700", label: "Quote Ready" },
        ACCEPTED: { color: "bg-green-100 text-green-700", label: "Accepted" },
        DECLINED: { color: "bg-red-100 text-red-700", label: "Declined" },
        IN_PROGRESS: { color: "bg-purple-100 text-purple-700", label: "In Progress" },
        ON_HOLD: { color: "bg-orange-100 text-orange-700", label: "On Hold" },
        COMPLETED: { color: "bg-green-100 text-green-700", label: "Completed" },
        CANCELLED: { color: "bg-gray-100 text-gray-700", label: "Cancelled" },
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-700", label: status };
    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>;
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [declineReason, setDeclineReason] = useState("");
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);

    const fetchProject = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/projects/my-projects/${id}`,
                { credentials: 'include' }
            );
            if (response.ok) {
                const data = await response.json();
                setProject(data);
            } else {
                router.push('/dashboard/projects');
            }
        } catch (error) {
            console.error('Failed to fetch project:', error);
            router.push('/dashboard/projects');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    const handleAcceptQuote = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/projects/my-projects/${id}/respond`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ action: 'ACCEPT' }),
                }
            );
            if (response.ok) {
                fetchProject();
            }
        } catch (error) {
            console.error('Failed to accept quote:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeclineQuote = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/projects/my-projects/${id}/respond`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        action: 'DECLINE',
                        declineReason: declineReason || undefined,
                    }),
                }
            );
            if (response.ok) {
                setShowDeclineDialog(false);
                fetchProject();
            }
        } catch (error) {
            console.error('Failed to decline quote:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/projects/my-projects/${id}/messages`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ message }),
                }
            );
            if (response.ok) {
                setMessage("");
                fetchProject();
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!project) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-6"
        >
            {/* Back Button */}
            <Button variant="ghost" asChild className="gap-2 -ml-2">
                <Link href="/dashboard/projects">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Link>
            </Button>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                        {getStatusBadge(project.status)}
                    </div>
                    <p className="text-muted-foreground">
                        Created on {formatDate(project.createdAt)}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Description</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="whitespace-pre-wrap">{project.description}</p>

                            {project.requirements && (
                                <div>
                                    <h4 className="font-medium mb-2">Technical Requirements</h4>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{project.requirements}</p>
                                </div>
                            )}

                            <div className="flex gap-6 pt-4 border-t">
                                {project.timeline && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span>Desired: {project.timeline}</span>
                                    </div>
                                )}
                                {project.budget && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <CurrencyDollar className="w-4 h-4 text-muted-foreground" />
                                        <span>Budget: {formatCurrency(project.budget)}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quote Section */}
                    {project.quotedPrice && (
                        <Card className={project.status === 'QUOTED' ? 'border-primary' : ''}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CurrencyDollar className="w-5 h-5 text-primary" />
                                    Quote from CVT
                                </CardTitle>
                                {project.quotedAt && (
                                    <CardDescription>
                                        Provided on {formatDate(project.quotedAt)}
                                        {project.quotedBy && ` by ${project.quotedBy.name}`}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Quoted Price</p>
                                        <p className="text-3xl font-bold text-primary">
                                            {formatCurrency(project.quotedPrice)}
                                        </p>
                                    </div>
                                    {project.quotedTimeline && (
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Estimated Timeline</p>
                                            <p className="text-lg font-semibold">{project.quotedTimeline}</p>
                                        </div>
                                    )}
                                </div>

                                {project.quoteNotes && (
                                    <div>
                                        <h4 className="font-medium mb-2">Notes</h4>
                                        <p className="text-muted-foreground whitespace-pre-wrap">{project.quoteNotes}</p>
                                    </div>
                                )}

                                {project.status === 'QUOTED' && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                            className="flex-1 gap-2"
                                            onClick={handleAcceptQuote}
                                            disabled={isSubmitting}
                                        >
                                            <CheckCircle weight="bold" className="w-4 h-4" />
                                            Accept Quote
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 gap-2 text-red-600 hover:text-red-700"
                                            onClick={() => setShowDeclineDialog(true)}
                                            disabled={isSubmitting}
                                        >
                                            <XCircle weight="bold" className="w-4 h-4" />
                                            Decline
                                        </Button>
                                    </div>
                                )}

                                {project.userAcceptedAt && (
                                    <div className="flex items-center gap-2 text-green-600 pt-4 border-t">
                                        <CheckCircle weight="fill" className="w-5 h-5" />
                                        <span>You accepted this quote on {formatDate(project.userAcceptedAt)}</span>
                                    </div>
                                )}

                                {project.userDeclinedAt && (
                                    <div className="pt-4 border-t">
                                        <div className="flex items-center gap-2 text-red-600 mb-2">
                                            <XCircle weight="fill" className="w-5 h-5" />
                                            <span>You declined this quote on {formatDate(project.userDeclinedAt)}</span>
                                        </div>
                                        {project.declineReason && (
                                            <p className="text-sm text-muted-foreground">
                                                Reason: {project.declineReason}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Deliverables */}
                    {project.deliverables && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    Deliverables
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{project.deliverables}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Messages */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ChatCircle className="w-5 h-5" />
                                Messages
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {project.messages.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">
                                    No messages yet. Start the conversation below.
                                </p>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {project.messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`p-3 rounded-lg ${msg.user.isAdmin
                                                    ? 'bg-primary/5 border-l-2 border-primary'
                                                    : 'bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm">
                                                    {msg.user.name || 'Unknown'}
                                                </span>
                                                {msg.user.isAdmin && (
                                                    <Badge variant="secondary" className="text-xs">CVT</Badge>
                                                )}
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(msg.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!['COMPLETED', 'CANCELLED', 'DECLINED'].includes(project.status) && (
                                <form onSubmit={handleSendMessage} className="pt-4 border-t">
                                    <Textarea
                                        placeholder="Type your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={3}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button type="submit" disabled={isSubmitting || !message.trim()}>
                                            Send Message
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <CheckCircle weight="fill" className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Request Submitted</p>
                                        <p className="text-xs text-muted-foreground">{formatDate(project.createdAt)}</p>
                                    </div>
                                </div>

                                {project.quotedAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                            <CurrencyDollar weight="fill" className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Quote Provided</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(project.quotedAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {project.userAcceptedAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <CheckCircle weight="fill" className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Quote Accepted</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(project.userAcceptedAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {project.userDeclinedAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                            <XCircle weight="fill" className="w-4 h-4 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Quote Declined</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(project.userDeclinedAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {project.startedAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                            <CalendarBlank weight="fill" className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Work Started</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(project.startedAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {project.completedAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <CheckCircle weight="fill" className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Project Completed</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(project.completedAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {project.status === 'PENDING' && (
                                    <div className="flex items-start gap-3 opacity-50">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                            <Clock weight="regular" className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Awaiting Quote</p>
                                            <p className="text-xs text-muted-foreground">We&apos;ll review your request soon</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Need Help */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Need Help?</p>
                                    <p className="text-xs text-muted-foreground">
                                        Contact us at support@cvt.co.zw
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Decline Dialog */}
            <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Warning weight="fill" className="w-5 h-5 text-amber-500" />
                            Decline Quote
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to decline this quote? You can provide a reason below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Reason for declining (optional)"
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeclineDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeclineQuote}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Declining..." : "Decline Quote"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
