"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
    CreditCard,
    CurrencyDollar,
    CheckCircle,
    Download,
    Receipt,
    CalendarBlank,
    ArrowUpRight,
    Trash,
    Star,
    DeviceMobile,
    Spinner,
    Warning,
} from "@phosphor-icons/react";
import {
    usePayments,
    useSavedPaymentMethods,
    useAddCardPaymentMethod,
    useAddMobileMoneyPaymentMethod,
    useDeletePaymentMethod,
    useSetDefaultPaymentMethod,
} from "@/lib/api";

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
        case "PAID":
        case "COMPLETED":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <CheckCircle weight="fill" className="w-3 h-3" />
                    Completed
                </Badge>
            );
        case "PENDING":
            return (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1">
                    Pending
                </Badge>
            );
        case "FAILED":
            return (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
                    Failed
                </Badge>
            );
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

const formatPaymentMethod = (method: string) => {
    const methodMap: Record<string, string> = {
        PAYNOW_ECOCASH: "Paynow - Ecocash",
        PAYNOW_ONEMONEY: "Paynow - OneMoney",
        PAYNOW_INNBUCKS: "Paynow - Innbucks",
        PAYNOW_VISA: "Paynow - VISA",
        PAYNOW_MASTERCARD: "Paynow - Mastercard",
        BANK_TRANSFER: "Bank Transfer",
        CASH: "Cash",
        CREDIT: "Credit",
    };
    return methodMap[method] || method;
};

function AddCardDialog() {
    const [open, setOpen] = useState(false);
    const [cardBrand, setCardBrand] = useState<"VISA" | "MASTERCARD">("VISA");
    const [cardLast4, setCardLast4] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardExpMonth, setCardExpMonth] = useState("");
    const [cardExpYear, setCardExpYear] = useState("");
    const [isDefault, setIsDefault] = useState(false);

    const addCard = useAddCardPaymentMethod();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addCard.mutateAsync({
                cardBrand,
                cardLast4,
                cardHolderName,
                cardExpMonth: parseInt(cardExpMonth),
                cardExpYear: parseInt(cardExpYear),
                isDefault,
            });
            setOpen(false);
            setCardLast4("");
            setCardHolderName("");
            setCardExpMonth("");
            setCardExpYear("");
            setIsDefault(false);
        } catch (error) {
            console.error("Failed to add card:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <CreditCard weight="regular" className="w-4 h-4" />
                    Add Card
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Card</DialogTitle>
                    <DialogDescription>
                        Add a VISA or Mastercard for future payments.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
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
                    <div>
                        <Label>Cardholder Name</Label>
                        <Input
                            placeholder="John Doe"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label>Last 4 Digits</Label>
                        <Input
                            placeholder="1234"
                            maxLength={4}
                            value={cardLast4}
                            onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ""))}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
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
                        <div>
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
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="defaultCard"
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="defaultCard" className="font-normal">Set as default payment method</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={addCard.isPending}>
                        {addCard.isPending ? (
                            <Spinner className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Add Card
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function AddMobileMoneyDialog() {
    const [open, setOpen] = useState(false);
    const [provider, setProvider] = useState<"ECOCASH" | "ONEMONEY" | "INNBUCKS">("ECOCASH");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isDefault, setIsDefault] = useState(false);

    const addMobile = useAddMobileMoneyPaymentMethod();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addMobile.mutateAsync({
                mobileProvider: provider,
                mobileNumber: phoneNumber,
                isDefault,
            });
            setOpen(false);
            setPhoneNumber("");
            setIsDefault(false);
        } catch (error) {
            console.error("Failed to add mobile money:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <DeviceMobile weight="regular" className="w-4 h-4" />
                    Add Mobile Money
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Mobile Money</DialogTitle>
                    <DialogDescription>
                        Add your Ecocash, OneMoney, or Innbucks number for payments.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Provider</Label>
                        <Select value={provider} onValueChange={(v) => setProvider(v as "ECOCASH" | "ONEMONEY" | "INNBUCKS")}>
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
                    <div>
                        <Label>Phone Number</Label>
                        <Input
                            placeholder="0771234567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Enter Zimbabwe phone number (e.g., 0771234567)
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="defaultMobile"
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="defaultMobile" className="font-normal">Set as default payment method</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={addMobile.isPending}>
                        {addMobile.isPending ? (
                            <Spinner className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Add Mobile Money
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function PaymentsPage() {
    const { data: payments, isLoading: paymentsLoading, error: paymentsError } = usePayments();
    const { data: paymentMethods, isLoading: methodsLoading } = useSavedPaymentMethods();
    const deletePaymentMethod = useDeletePaymentMethod();
    const setDefaultPaymentMethod = useSetDefaultPaymentMethod();

    const paymentSummary = {
        totalPaid: payments?.filter(p => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0) || 0,
        paymentsThisYear: payments?.filter(p => new Date(p.createdAt).getFullYear() === new Date().getFullYear()).length || 0,
        lastPaymentDate: payments?.[0]?.createdAt
            ? new Date(payments[0].createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : "N/A",
        preferredMethod: paymentMethods?.find(m => m.isDefault)?.nickname || "None set",
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
                <p className="text-muted-foreground mt-1">
                    View all your past payments and manage payment methods
                </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <CurrencyDollar weight="duotone" className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Paid</p>
                                <p className="text-2xl font-bold">${(paymentSummary.totalPaid / 100).toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Receipt weight="duotone" className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Payments ({new Date().getFullYear()})</p>
                                <p className="text-2xl font-bold">{paymentSummary.paymentsThisYear}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <CalendarBlank weight="duotone" className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Last Payment</p>
                                <p className="text-lg font-semibold">{paymentSummary.lastPaymentDate}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <CreditCard weight="duotone" className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Default Method</p>
                                <p className="text-base font-semibold truncate max-w-[150px]">{paymentSummary.preferredMethod}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Saved Payment Methods</CardTitle>
                                <CardDescription>
                                    Manage your saved cards and mobile money accounts
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <AddCardDialog />
                                <AddMobileMoneyDialog />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {methodsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Spinner className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : paymentMethods && paymentMethods.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`relative p-4 rounded-lg border-2 ${method.isDefault ? "border-primary bg-primary/5" : "border-gray-200"
                                            }`}
                                    >
                                        {method.isDefault && (
                                            <Badge className="absolute -top-2 -right-2 bg-primary gap-1">
                                                <Star weight="fill" className="w-3 h-3" />
                                                Default
                                            </Badge>
                                        )}
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                {method.type === "CARD" ? (
                                                    <CreditCard weight="duotone" className="w-5 h-5 text-gray-600" />
                                                ) : (
                                                    <DeviceMobile weight="duotone" className="w-5 h-5 text-gray-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{method.nickname}</p>
                                                {method.type === "CARD" ? (
                                                    <p className="text-sm text-muted-foreground">
                                                        Expires {method.cardExpMonth?.toString().padStart(2, "0")}/{method.cardExpYear}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        {method.mobileProvider}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            {!method.isDefault && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDefaultPaymentMethod.mutate(method.id)}
                                                    disabled={setDefaultPaymentMethod.isPending}
                                                >
                                                    Set Default
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => deletePaymentMethod.mutate(method.id)}
                                                disabled={deletePaymentMethod.isPending}
                                            >
                                                <Trash weight="regular" className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <CreditCard weight="duotone" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No payment methods saved</p>
                                <p className="text-sm">Add a card or mobile money account above</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>All Payments</CardTitle>
                        <CardDescription>
                            Complete history of all your payments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {paymentsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Spinner className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : paymentsError ? (
                            <div className="flex flex-col items-center justify-center py-8 text-red-600">
                                <Warning weight="duotone" className="w-8 h-8 mb-2" />
                                <p>Failed to load payments</p>
                            </div>
                        ) : payments && payments.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Invoice</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                {new Date(payment.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell>${(payment.amount / 100).toFixed(2)}</TableCell>
                                            <TableCell>{formatPaymentMethod(payment.method)}</TableCell>
                                            <TableCell>
                                                {payment.invoice ? (
                                                    <Button variant="link" className="p-0 h-auto text-primary gap-1">
                                                        {payment.invoice.invoiceNumber}
                                                        <ArrowUpRight className="w-3 h-3" />
                                                    </Button>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="gap-1">
                                                    <Download weight="regular" className="w-4 h-4" />
                                                    Receipt
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Receipt weight="duotone" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No payments yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <CreditCard weight="duotone" className="w-8 h-8 text-primary flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                                <p className="text-sm text-muted-foreground">
                                    All payments are processed securely through Paynow. We accept Ecocash,
                                    OneMoney, Innbucks, VISA, Mastercard, and bank transfers. For any payment issues or
                                    refund requests, please contact our support team.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
