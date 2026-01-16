"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Key,
    Plus,
    Copy,
    CheckCircle,
    XCircle,
    Trash,
    Warning,
    Eye,
    EyeSlash,
    Shield,
    SpinnerGap,
} from "@phosphor-icons/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

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

interface ApiKeyData {
    id: string;
    name: string;
    keyPrefix: string;
    scopes: string[];
    isActive: boolean;
    createdAt: string;
    expiresAt: string | null;
    lastUsedAt: string | null;
}

const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
        return (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                <CheckCircle weight="fill" className="w-3 h-3" />
                Active
            </Badge>
        );
    }
    return (
        <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 gap-1">
            <XCircle weight="fill" className="w-3 h-3" />
            Inactive
        </Badge>
    );
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const formatLastUsed = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    return formatDate(dateString);
};

export default function ApiKeysPage() {
    const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [showKey, setShowKey] = useState(true);
    const [copied, setCopied] = useState(false);
    const [keyToDelete, setKeyToDelete] = useState<ApiKeyData | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const activeKeys = apiKeys.filter(k => k.isActive);

    // Fetch API keys
    const fetchApiKeys = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/api-keys/my-keys`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setApiKeys(data);
            }
        } catch (error) {
            console.error("Failed to fetch API keys:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApiKeys();
    }, [fetchApiKeys]);

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) return;

        setIsCreating(true);
        try {
            const response = await fetch(`${API_URL}/api-keys/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: newKeyName }),
            });

            if (response.ok) {
                const data = await response.json();
                setGeneratedKey(data.key);
                // Refresh the list
                fetchApiKeys();
            }
        } catch (error) {
            console.error("Failed to create API key:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleCopyKey = async () => {
        if (generatedKey) {
            await navigator.clipboard.writeText(generatedKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCloseCreateDialog = () => {
        setIsCreateOpen(false);
        setNewKeyName("");
        setGeneratedKey(null);
        setShowKey(true);
    };

    const handleDeleteKey = async () => {
        if (!keyToDelete) return;

        const expectedConfirmation = "delete my cvt api key";
        if (deleteConfirmation.toLowerCase() !== expectedConfirmation) {
            setDeleteError(`Please type "${expectedConfirmation}" to confirm`);
            return;
        }

        setIsDeleting(true);
        setDeleteError("");

        try {
            const response = await fetch(`${API_URL}/api-keys/${keyToDelete.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ confirmationText: deleteConfirmation }),
            });

            if (response.ok) {
                setKeyToDelete(null);
                setDeleteConfirmation("");
                fetchApiKeys();
            } else {
                const data = await response.json();
                setDeleteError(data.message || "Failed to delete API key");
            }
        } catch (error) {
            setDeleteError("Failed to delete API key");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteDialog = () => {
        setKeyToDelete(null);
        setDeleteConfirmation("");
        setDeleteError("");
    };

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
                    <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your API keys for POS integrations
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={(open) => {
                    if (!open) handleCloseCreateDialog();
                    else setIsCreateOpen(true);
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 gap-2">
                            <Plus weight="bold" className="w-4 h-4" />
                            Generate New Key
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {generatedKey ? "API Key Generated" : "Generate New API Key"}
                            </DialogTitle>
                            <DialogDescription>
                                {generatedKey
                                    ? "Make sure to copy your API key now. You won't be able to see it again!"
                                    : "Give your API key a descriptive name to help identify its purpose."
                                }
                            </DialogDescription>
                        </DialogHeader>

                        {!generatedKey ? (
                            <>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="keyName">Key Name</Label>
                                        <Input
                                            id="keyName"
                                            placeholder="e.g., Production POS Integration"
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={handleCloseCreateDialog}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateKey}
                                        disabled={!newKeyName.trim() || isCreating}
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        {isCreating ? (
                                            <>
                                                <SpinnerGap weight="bold" className="w-4 h-4 mr-2 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            "Generate Key"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </>
                        ) : (
                            <>
                                <div className="space-y-4 py-4">
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-amber-700 mb-2">
                                            <Warning weight="fill" className="w-5 h-5" />
                                            <span className="font-medium">Important</span>
                                        </div>
                                        <p className="text-sm text-amber-700">
                                            This is the only time you'll see this key. Copy it now and store it securely.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Your API Key</Label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 relative">
                                                <Input
                                                    readOnly
                                                    value={showKey ? generatedKey : "•".repeat(40)}
                                                    className="font-mono pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowKey(!showKey)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showKey ? (
                                                        <EyeSlash weight="regular" className="w-4 h-4" />
                                                    ) : (
                                                        <Eye weight="regular" className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={handleCopyKey}
                                                className="gap-2"
                                            >
                                                {copied ? (
                                                    <>
                                                        <CheckCircle weight="fill" className="w-4 h-4 text-green-600" />
                                                        Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy weight="regular" className="w-4 h-4" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCloseCreateDialog} className="bg-primary hover:bg-primary/90">
                                        Done
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Summary Cards */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Key weight="duotone" className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Keys</p>
                                <p className="text-2xl font-bold">{apiKeys.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <CheckCircle weight="duotone" className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active Keys</p>
                                <p className="text-2xl font-bold">{activeKeys.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <Shield weight="duotone" className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Security Status</p>
                                <p className="text-lg font-semibold text-green-600">Secure</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* API Keys Table */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Your API Keys</CardTitle>
                        <CardDescription>
                            View and manage your API keys. Revoke any keys that are no longer in use.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Last Used</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <SpinnerGap weight="bold" className="w-6 h-6 animate-spin mx-auto text-primary" />
                                            <p className="text-muted-foreground mt-2">Loading API keys...</p>
                                        </TableCell>
                                    </TableRow>
                                ) : apiKeys.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <Key weight="duotone" className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-muted-foreground">No API keys yet</p>
                                            <p className="text-sm text-muted-foreground">Generate your first API key to get started</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    apiKeys.map((apiKey) => (
                                        <TableRow key={apiKey.id}>
                                            <TableCell className="font-medium">{apiKey.name}</TableCell>
                                            <TableCell>
                                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                    {apiKey.keyPrefix}****
                                                </code>
                                            </TableCell>
                                            <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                                            <TableCell>{formatLastUsed(apiKey.lastUsedAt)}</TableCell>
                                            <TableCell>{getStatusBadge(apiKey.isActive)}</TableCell>
                                            <TableCell className="text-right">
                                                {apiKey.isActive && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => setKeyToDelete(apiKey)}
                                                    >
                                                        <Trash weight="regular" className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Best Practices */}
            <motion.div variants={itemVariants}>
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <Shield weight="duotone" className="w-8 h-8 text-primary flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">API Key Best Practices</h3>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Never share your API keys or commit them to version control</li>
                                    <li>• Use environment variables to store keys in your applications</li>
                                    <li>• Rotate keys periodically and revoke unused keys</li>
                                    <li>• Use separate keys for development and production environments</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!keyToDelete} onOpenChange={(open) => !open && handleCloseDeleteDialog()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">Delete API Key</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4">
                                <p>
                                    You are about to permanently delete the API key <strong>"{keyToDelete?.name}"</strong>.
                                </p>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-red-700 mb-2">
                                        <Warning weight="fill" className="w-5 h-5" />
                                        <span className="font-medium">Warning</span>
                                    </div>
                                    <p className="text-sm text-red-700">
                                        This action cannot be undone. Any applications using this key will
                                        immediately lose access.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deleteConfirmation">
                                        To confirm, type <code className="bg-gray-100 px-2 py-1 rounded text-sm">delete my cvt api key</code>
                                    </Label>
                                    <Input
                                        id="deleteConfirmation"
                                        value={deleteConfirmation}
                                        onChange={(e) => {
                                            setDeleteConfirmation(e.target.value);
                                            setDeleteError("");
                                        }}
                                        placeholder="delete my cvt api key"
                                        className={deleteError ? "border-red-500" : ""}
                                    />
                                    {deleteError && (
                                        <p className="text-sm text-red-600">{deleteError}</p>
                                    )}
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={handleCloseDeleteDialog} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteKey}
                            disabled={isDeleting || deleteConfirmation.toLowerCase() !== "delete my cvt api key"}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <>
                                    <SpinnerGap weight="bold" className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete API Key"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}
