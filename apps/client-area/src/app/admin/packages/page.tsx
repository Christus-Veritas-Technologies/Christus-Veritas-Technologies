"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Package,
  Plus,
  Pencil,
  Trash,
  CaretDown,
  CaretRight,
} from "@phosphor-icons/react";
import { apiClientWithAuth } from "@/lib/api-client";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface PackageItem {
  id: string;
  productId: string;
  quantity: number;
  priceOverride: number | null;
  product: Product;
}

interface PackageVariant {
  id: string;
  name: string;
  description: string | null;
  priceOverride: number | null;
  isDefault: boolean;
  items: PackageItem[];
}

interface PackageData {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  isActive: boolean;
  isFeatured: boolean;
  variants: PackageVariant[];
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(new Set());

  // Package dialog
  const [packageDialog, setPackageDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);
  const [packageForm, setPackageForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
    isActive: true,
    isFeatured: false,
  });

  // Variant dialog
  const [variantDialog, setVariantDialog] = useState(false);
  const [editingVariant, setEditingVariant] = useState<PackageVariant | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [variantForm, setVariantForm] = useState({
    name: "",
    description: "",
    priceOverride: "",
    isDefault: false,
    items: [] as { productId: string; quantity: number; priceOverride: string }[],
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [packagesRes, productsRes] = await Promise.all([
        apiClientWithAuth<PackageData[]>("/admin/packages"),
        apiClientWithAuth<Product[]>("/admin/packages/products"),
      ]);

      if (packagesRes.ok && packagesRes.data) {
        setPackages(packagesRes.data);
      }
      if (productsRes.ok && productsRes.data) {
        setProducts(productsRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePackageExpand = (packageId: string) => {
    const newExpanded = new Set(expandedPackages);
    if (newExpanded.has(packageId)) {
      newExpanded.delete(packageId);
    } else {
      newExpanded.add(packageId);
    }
    setExpandedPackages(newExpanded);
  };

  const openCreatePackageDialog = () => {
    setEditingPackage(null);
    setPackageForm({
      name: "",
      description: "",
      imageUrl: "",
      category: "",
      isActive: true,
      isFeatured: false,
    });
    setPackageDialog(true);
  };

  const openEditPackageDialog = (pkg: PackageData) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name,
      description: pkg.description || "",
      imageUrl: pkg.imageUrl || "",
      category: pkg.category || "",
      isActive: pkg.isActive,
      isFeatured: pkg.isFeatured,
    });
    setPackageDialog(true);
  };

  const handleSavePackage = async () => {
    try {
      const data = {
        name: packageForm.name,
        description: packageForm.description || null,
        imageUrl: packageForm.imageUrl || null,
        category: packageForm.category || null,
        isActive: packageForm.isActive,
        isFeatured: packageForm.isFeatured,
      };

      if (editingPackage) {
        await apiClientWithAuth(`/admin/packages/${editingPackage.id}`, {
          method: "PUT",
          body: data,
        });
      } else {
        await apiClientWithAuth("/admin/packages", {
          method: "POST",
          body: data,
        });
      }

      setPackageDialog(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Delete this package? All variants will also be deleted.")) return;
    try {
      await apiClientWithAuth(`/admin/packages/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateVariantDialog = (packageId: string) => {
    setEditingVariant(null);
    setSelectedPackageId(packageId);
    setVariantForm({
      name: "",
      description: "",
      priceOverride: "",
      isDefault: false,
      items: [{ productId: "", quantity: 1, priceOverride: "" }],
    });
    setVariantDialog(true);
  };

  const openEditVariantDialog = (packageId: string, variant: PackageVariant) => {
    setEditingVariant(variant);
    setSelectedPackageId(packageId);
    setVariantForm({
      name: variant.name,
      description: variant.description || "",
      priceOverride: variant.priceOverride ? (variant.priceOverride / 100).toString() : "",
      isDefault: variant.isDefault,
      items: variant.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceOverride: item.priceOverride ? (item.priceOverride / 100).toString() : "",
      })),
    });
    setVariantDialog(true);
  };

  const addItemRow = () => {
    setVariantForm({
      ...variantForm,
      items: [...variantForm.items, { productId: "", quantity: 1, priceOverride: "" }],
    });
  };

  const removeItemRow = (index: number) => {
    setVariantForm({
      ...variantForm,
      items: variantForm.items.filter((_, i) => i !== index),
    });
  };

  const updateItemRow = (index: number, field: string, value: string | number) => {
    const newItems = [...variantForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setVariantForm({ ...variantForm, items: newItems });
  };

  const handleSaveVariant = async () => {
    if (!selectedPackageId) return;

    try {
      const data = {
        name: variantForm.name,
        description: variantForm.description || null,
        priceOverride: variantForm.priceOverride
          ? Math.round(parseFloat(variantForm.priceOverride) * 100)
          : null,
        isDefault: variantForm.isDefault,
        items: variantForm.items
          .filter((item) => item.productId)
          .map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceOverride: item.priceOverride
              ? Math.round(parseFloat(item.priceOverride) * 100)
              : undefined,
          })),
      };

      if (editingVariant) {
        // Update variant (items are handled separately)
        await apiClientWithAuth(`/admin/packages/variants/${editingVariant.id}`, {
          method: "PUT",
          body: {
            name: data.name,
            description: data.description,
            priceOverride: data.priceOverride,
            isDefault: data.isDefault,
          },
        });
      } else {
        await apiClientWithAuth(`/admin/packages/${selectedPackageId}/variants`, {
          method: "POST",
          body: data,
        });
      }

      setVariantDialog(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Delete this variant?")) return;
    try {
      await apiClientWithAuth(`/admin/packages/variants/${variantId}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const calculateVariantPrice = (variant: PackageVariant): number => {
    if (variant.priceOverride) return variant.priceOverride;
    return variant.items.reduce((sum, item) => {
      const price = item.priceOverride ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Product Packages</h1>
          <p className="text-gray-500 text-sm">
            Create and manage product bundles with variants
          </p>
        </div>
        <Button onClick={openCreatePackageDialog}>
          <Plus weight="bold" className="w-4 h-4 mr-2" />
          New Package
        </Button>
      </div>

      {packages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package weight="duotone" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="font-medium text-lg mb-2">No Packages Yet</h3>
            <p className="text-gray-500 mb-4">
              Create product packages to bundle multiple products together
            </p>
            <Button onClick={openCreatePackageDialog}>Create First Package</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => togglePackageExpand(pkg.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {expandedPackages.has(pkg.id) ? (
                      <CaretDown weight="bold" className="w-5 h-5 text-white" />
                    ) : (
                      <CaretRight weight="bold" className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{pkg.name}</h3>
                      {!pkg.isActive && (
                        <Badge variant="outline" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                      {pkg.isFeatured && (
                        <Badge className="bg-yellow-500 text-xs">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {pkg.variants.length} variant{pkg.variants.length !== 1 ? "s" : ""}
                      {pkg.category && ` • ${pkg.category}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditPackageDialog(pkg)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeletePackage(pkg.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {expandedPackages.has(pkg.id) && (
                <div className="border-t bg-gray-50 dark:bg-gray-900 p-4">
                  {pkg.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {pkg.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">Variants</h4>
                    <Button size="sm" variant="outline" onClick={() => openCreateVariantDialog(pkg.id)}>
                      <Plus weight="bold" className="w-3 h-3 mr-1" />
                      Add Variant
                    </Button>
                  </div>

                  {pkg.variants.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No variants yet. Add a variant with products.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {pkg.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="bg-white dark:bg-gray-800 rounded-lg p-4 border"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium">{variant.name}</h5>
                                {variant.isDefault && (
                                  <Badge variant="secondary" className="text-xs">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(calculateVariantPrice(variant))}
                                {variant.priceOverride && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    (custom price)
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditVariantDialog(pkg.id, variant)}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500"
                                onClick={() => handleDeleteVariant(variant.id)}
                              >
                                <Trash className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {variant.items.length > 0 && (
                            <div className="space-y-1">
                              {variant.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between text-sm py-1 border-b last:border-0 border-dashed"
                                >
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {item.quantity}× {item.product.name}
                                  </span>
                                  <span className="text-gray-500">
                                    {formatCurrency(
                                      (item.priceOverride ?? item.product.price) * item.quantity
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Package Dialog */}
      <Dialog open={packageDialog} onOpenChange={setPackageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package" : "Create Package"}
            </DialogTitle>
            <DialogDescription>
              {editingPackage
                ? "Update package details"
                : "Create a new product package"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={packageForm.name}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, name: e.target.value })
                }
                placeholder="CCTV Security System"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={packageForm.description}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, description: e.target.value })
                }
                placeholder="Complete security camera solution..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={packageForm.imageUrl}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, imageUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={packageForm.category}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, category: e.target.value })
                }
                placeholder="Security, Networking, etc."
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={packageForm.isActive}
                onCheckedChange={(checked) =>
                  setPackageForm({ ...packageForm, isActive: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Featured</Label>
              <Switch
                checked={packageForm.isFeatured}
                onCheckedChange={(checked) =>
                  setPackageForm({ ...packageForm, isFeatured: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPackageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePackage} disabled={!packageForm.name}>
              {editingPackage ? "Save Changes" : "Create Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variant Dialog */}
      <Dialog open={variantDialog} onOpenChange={setVariantDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVariant ? "Edit Variant" : "Create Variant"}
            </DialogTitle>
            <DialogDescription>
              Configure variant with products and quantities
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="variantName">Variant Name</Label>
              <Input
                id="variantName"
                value={variantForm.name}
                onChange={(e) =>
                  setVariantForm({ ...variantForm, name: e.target.value })
                }
                placeholder="4 Camera System"
              />
            </div>

            <div>
              <Label htmlFor="variantDesc">Description (optional)</Label>
              <Textarea
                id="variantDesc"
                value={variantForm.description}
                onChange={(e) =>
                  setVariantForm({ ...variantForm, description: e.target.value })
                }
                placeholder="Includes 4 HD cameras..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="priceOverride">Price Override (USD, optional)</Label>
              <Input
                id="priceOverride"
                type="number"
                step="0.01"
                value={variantForm.priceOverride}
                onChange={(e) =>
                  setVariantForm({ ...variantForm, priceOverride: e.target.value })
                }
                placeholder="Leave blank to use sum of products"
              />
              <p className="text-xs text-gray-500 mt-1">
                If set, this overrides the calculated total
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label>Default Variant</Label>
              <Switch
                checked={variantForm.isDefault}
                onCheckedChange={(checked) =>
                  setVariantForm({ ...variantForm, isDefault: checked })
                }
              />
            </div>

            {!editingVariant && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Products</Label>
                  <Button size="sm" variant="outline" onClick={addItemRow}>
                    <Plus weight="bold" className="w-3 h-3 mr-1" />
                    Add Product
                  </Button>
                </div>

                <div className="space-y-2">
                  {variantForm.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <select
                        className="flex-1 border rounded-md p-2 text-sm"
                        value={item.productId}
                        onChange={(e) =>
                          updateItemRow(index, "productId", e.target.value)
                        }
                      >
                        <option value="">Select product...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({formatCurrency(p.price)})
                          </option>
                        ))}
                      </select>
                      <Input
                        type="number"
                        min="1"
                        className="w-20"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItemRow(index, "quantity", parseInt(e.target.value) || 1)
                        }
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => removeItemRow(index)}
                        disabled={variantForm.items.length === 1}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {editingVariant && (
              <p className="text-sm text-gray-500 italic">
                To modify products, delete and recreate the variant.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setVariantDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveVariant}
              disabled={
                !variantForm.name ||
                (!editingVariant && variantForm.items.every((i) => !i.productId))
              }
            >
              {editingVariant ? "Save Changes" : "Create Variant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
