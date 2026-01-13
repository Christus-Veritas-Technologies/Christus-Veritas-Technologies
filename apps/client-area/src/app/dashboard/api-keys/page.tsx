"use client";

import { useState } from "react";
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
    AlertDialogAction,
    AlertDialogCancel,
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
const mockApiKeys = [
    {
        id: "key_1",
        name: "Production POS Integration",
        prefix: "cvt_prod_****8a3f",
        createdAt: "January 15, 2026",
        lastUsed: "2 hours ago",
        status: "ACTIVE" as const,
    },
    {
        id: "key_2",
        name: "Development Testing",
        prefix: "cvt_dev_****2b1c",
        createdAt: "December 10, 2025",
        lastUsed: "5 days ago",
        status: "ACTIVE" as const,
    },
    {
        id: "key_3",
        name: "Old Integration",
        prefix: "cvt_prod_****9d4e",
        createdAt: "August 5, 2025",
        lastUsed: "30 days ago",
        status: "REVOKED" as const,
    },
];

type ApiKey = typeof mockApiKeys[0];

const getStatusBadge = (status: "ACTIVE" | "REVOKED") => {
    switch (status) {
        case "ACTIVE":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Active
                </Badge>
            );
        case "REVOKED":
            return (
                <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 gap-1">
                    <XCircle weight="fill" className="w-3 h-3" />
                    Revoked
                </Badge>
            );
    }
};

export default function ApiKeysPage() {
    const [apiKeys, setApiKeys] = useState(mockApiKeys);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [showKey, setShowKey] = useState(true);
    const [copied, setCopied] = useState(false);
    const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);

    const activeKeys = apiKeys.filter(k => k.status === "ACTIVE");

    const handleCreateKey = () => {
        // Mock key generation - in real app, this would call the API
        const newKey = `cvt_prod_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        setGeneratedKey(newKey);

        // Add to list (in real app, this would be handled by the API response)
        const prefix = `cvt_prod_****${newKey.slice(-4)}`;
        setApiKeys(prev => [
            {
                id: `key_${Date.now()}`,
                name: newKeyName,
                prefix,
                createdAt: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                lastUsed: "Never",
                status: "ACTIVE" as const,
            },
            ...prev,
        ]);
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

    const handleRevokeKey = () => {
        if (keyToRevoke) {
            setApiKeys(prev =>
                prev.map(key =>
                    key.id === keyToRevoke.id
                        ? { ...key, status: "REVOKED" as const }
                        : key
                )
            );
            setKeyToRevoke(null);
        }
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
                                        disabled={!newKeyName.trim()}
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        Generate Key
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
                                {apiKeys.map((apiKey) => (
                                    <TableRow key={apiKey.id}>
                                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                                        <TableCell>
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                {apiKey.prefix}
                                            </code>
                                        </TableCell>
                                        <TableCell>{apiKey.createdAt}</TableCell>
                                        <TableCell>{apiKey.lastUsed}</TableCell>
                                        <TableCell>{getStatusBadge(apiKey.status)}</TableCell>
                                        <TableCell className="text-right">
                                            {apiKey.status === "ACTIVE" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setKeyToRevoke(apiKey)}
                                                >
                                                    <Trash weight="regular" className="w-4 h-4 mr-1" />
                                                    Revoke
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
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

            {/* Revoke Confirmation Dialog */}
            <AlertDialog open={!!keyToRevoke} onOpenChange={(open) => !open && setKeyToRevoke(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to revoke the API key "{keyToRevoke?.name}"?
                            This action cannot be undone and any applications using this key will
                            stop working immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRevokeKey}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Revoke Key
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}
