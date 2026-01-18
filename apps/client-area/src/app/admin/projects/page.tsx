"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Briefcase,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    HourglassHigh,
    CurrencyDollar,
    CaretLeft,
    CaretRight,
    ChatCircle,
    User,
    Calendar,
    Tag,
} from "@phosphor-icons/react";
import { apiClientWithAuth } from "@/lib/api-client";

interface Project {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    quotedPrice: number | null;
    quotedAt: string | null;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        email: string;
        businessName: string | null;
    };
}

interface ProjectStats {
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    totalQuotedValue: number;
    totalCompletedValue: number;
}

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    QUOTED: "bg-blue-100 text-blue-700",
    ACCEPTED: "bg-green-100 text-green-700",
    DECLINED: "bg-red-100 text-red-700",
    IN_PROGRESS: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-green-200 text-green-800",
    CANCELLED: "bg-gray-100 text-gray-700",
};

const priorityColors: Record<string, string> = {
    LOW: "bg-gray-100 text-gray-700",
    NORMAL: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [stats, setStats] = useState<ProjectStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
    const [quotePrice, setQuotePrice] = useState("");
    const [quoteEstimatedDays, setQuoteEstimatedDays] = useState("");
    const [quoteNotes, setQuoteNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            const statusParam = statusFilter !== "all" ? `?status=${statusFilter}` : "";
            const [projectsRes, statsRes] = await Promise.all([
                apiClientWithAuth<Project[]>(`/projects/admin/all${statusParam}`),
                apiClientWithAuth<ProjectStats>("/admin/projects/stats"),
            ]);

            if (projectsRes.ok && projectsRes.data) {
                setProjects(projectsRes.data);
            }

            if (statsRes.ok && statsRes.data) {
                setStats(statsRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [statusFilter]);

    const openProjectDetails = (project: Project) => {
        setSelectedProject(project);
        setIsDialogOpen(true);
    };

    const openQuoteDialog = (project: Project) => {
        setSelectedProject(project);
        setQuotePrice(project.quotedPrice ? (project.quotedPrice / 100).toString() : "");
        setQuoteEstimatedDays("");
        setQuoteNotes("");
        setIsQuoteDialogOpen(true);
    };

    const submitQuote = async () => {
        if (!selectedProject || !quotePrice) return;
        setIsSubmitting(true);

        try {
            const response = await apiClientWithAuth(`/projects/admin/${selectedProject.id}/quote`, {
                method: "POST",
                body: {
                    quotedPrice: Math.round(parseFloat(quotePrice) * 100),
                    estimatedDays: parseInt(quoteEstimatedDays) || undefined,
                    notes: quoteNotes || undefined,
                },
            });

            if (!response.ok) throw new Error("Failed to submit quote");

            setIsQuoteDialogOpen(false);
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateStatus = async (projectId: string, action: string, reason?: string) => {
        try {
            const response = await apiClientWithAuth(`/projects/admin/${projectId}/status`, {
                method: "POST",
                body: { action, reason },
            });

            if (!response.ok) throw new Error("Failed to update status");

            setIsDialogOpen(false);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage client project requests and quotes
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                    <p className="text-2xl font-bold">
                                        {stats.byStatus.PENDING || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <HourglassHigh className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">In Progress</p>
                                    <p className="text-2xl font-bold">
                                        {stats.byStatus.IN_PROGRESS || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="text-2xl font-bold">
                                        {stats.byStatus.COMPLETED || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <CurrencyDollar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Value</p>
                                    <p className="text-2xl font-bold">
                                        ${stats.totalQuotedValue.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filter and Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Projects</CardTitle>
                            <CardDescription>
                                View and manage all project requests
                            </CardDescription>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="QUOTED">Quoted</SelectItem>
                                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="DECLINED">Declined</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Quote</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(7)].map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground">No projects found</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{project.title}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm">
                                                    {project.user.name || project.user.email}
                                                </p>
                                                {project.user.businessName && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {project.user.businessName}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={priorityColors[project.priority]}>
                                                {project.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[project.status]}>
                                                {project.status.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {project.quotedPrice ? (
                                                <span className="font-medium">
                                                    ${(project.quotedPrice / 100).toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{formatDate(project.createdAt)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openProjectDetails(project)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                {project.status === "PENDING" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openQuoteDialog(project)}
                                                    >
                                                        <CurrencyDollar className="w-4 h-4 mr-1" />
                                                        Quote
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Project Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    {selectedProject && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedProject.title}</DialogTitle>
                                <DialogDescription>
                                    Project details and management
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 mt-4">
                                {/* Status and Priority */}
                                <div className="flex items-center gap-3">
                                    <Badge className={statusColors[selectedProject.status]}>
                                        {selectedProject.status.replace("_", " ")}
                                    </Badge>
                                    <Badge className={priorityColors[selectedProject.priority]}>
                                        {selectedProject.priority} Priority
                                    </Badge>
                                </div>

                                {/* Description */}
                                <div>
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {selectedProject.description}
                                    </p>
                                </div>

                                {/* Client Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span>
                                            {selectedProject.user.name || selectedProject.user.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span>Created {formatDate(selectedProject.createdAt)}</span>
                                    </div>
                                    {selectedProject.user.businessName && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                                            <span>{selectedProject.user.businessName}</span>
                                        </div>
                                    )}
                                    {selectedProject.quotedPrice && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <CurrencyDollar className="w-4 h-4 text-muted-foreground" />
                                            <span>
                                                Quoted ${(selectedProject.quotedPrice / 100).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t">
                                    {selectedProject.status === "PENDING" && (
                                        <Button onClick={() => openQuoteDialog(selectedProject)}>
                                            <CurrencyDollar className="w-4 h-4 mr-2" />
                                            Send Quote
                                        </Button>
                                    )}
                                    {selectedProject.status === "ACCEPTED" && (
                                        <Button
                                            onClick={() =>
                                                updateStatus(selectedProject.id, "start")
                                            }
                                        >
                                            <HourglassHigh className="w-4 h-4 mr-2" />
                                            Start Project
                                        </Button>
                                    )}
                                    {selectedProject.status === "IN_PROGRESS" && (
                                        <Button
                                            onClick={() =>
                                                updateStatus(selectedProject.id, "complete")
                                            }
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Mark Complete
                                        </Button>
                                    )}
                                    {["PENDING", "QUOTED", "ACCEPTED", "IN_PROGRESS"].includes(
                                        selectedProject.status
                                    ) && (
                                            <Button
                                                variant="outline"
                                                className="text-red-600"
                                                onClick={() =>
                                                    updateStatus(selectedProject.id, "cancel")
                                                }
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Cancel
                                            </Button>
                                        )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Quote Dialog */}
            <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Quote</DialogTitle>
                        <DialogDescription>
                            Provide a price quote for "{selectedProject?.title}"
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="quotePrice">Price (USD) *</Label>
                            <Input
                                id="quotePrice"
                                type="number"
                                step="0.01"
                                min="0"
                                value={quotePrice}
                                onChange={(e) => setQuotePrice(e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quoteEstimatedDays">Estimated Days</Label>
                            <Input
                                id="quoteEstimatedDays"
                                type="number"
                                min="1"
                                value={quoteEstimatedDays}
                                onChange={(e) => setQuoteEstimatedDays(e.target.value)}
                                placeholder="e.g., 14"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quoteNotes">Notes</Label>
                            <Textarea
                                id="quoteNotes"
                                value={quoteNotes}
                                onChange={(e) => setQuoteNotes(e.target.value)}
                                placeholder="Additional notes for the client..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsQuoteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={submitQuote} disabled={isSubmitting || !quotePrice}>
                            {isSubmitting ? "Sending..." : "Send Quote"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
