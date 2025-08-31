"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function ViewAllProductsPage() {
  const products = useQuery(api.viewProducts.getAll);
  const deleteProduct = useMutation(api.deleteProduct.deleteProduct);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

  // ✅ delete handler
  const handleDeleteProduct = async (
    productId: string,
    productName: string
  ) => {
    try {
      setDeletingProductId(productId);
      await deleteProduct({ id: productId });
      toast.success(`Product "${productName}" deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    } finally {
      setDeletingProductId(null);
    }
  };

  if (products === undefined) {
    // Loading state
    return (
      <div className="container mx-auto p-6 mt-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto p-6 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-gray-500 mb-4">No products found</div>
            <Link
              href="/dashboard/products/add"
              className="bg-black text-white py-2 px-6 flex items-center justify-center rounded-md hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Product
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  const getStatusBadges = (flags: any) => {
    const badges = [];
    if (flags.isActive)
      badges.push({ label: "Active", variant: "default" as const });
    if (flags.isNewArrival)
      badges.push({ label: "New", variant: "secondary" as const });
    if (flags.isOnSale)
      badges.push({ label: "Sale", variant: "destructive" as const });
    if (flags.isFastSelling)
      badges.push({ label: "Fast Selling", variant: "outline" as const });
    if (flags.isLimitedEdition)
      badges.push({ label: "Limited", variant: "outline" as const });
    return badges;
  };

  return (
    <div className="container mx-auto p-6 mt-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">{products.length} total products</p>
        </div>
        <Link
          href="/dashboard/products/add"
          className="flex items-center justify-center bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Product</th>
                  <th className="text-left py-3 px-2">Category</th>
                  <th className="text-left py-3 px-2">Price</th>
                  <th className="text-left py-3 px-2">Size</th>
                  <th className="text-left py-3 px-2">Colors</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        {product.images && product.images.length > 0 ? (
                          <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">
                              No Image
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {product.description}
                          </div>
                          <div className="text-xs text-gray-400">
                            Slug: {product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant="outline">
                        {product.category || "Uncategorized"}
                      </Badge>
                    </td>
                    <td className="py-4 px-2">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {formatPrice(product.basePrice)}
                        </div>
                        {product.salePrice &&
                          product.salePrice !== product.basePrice && (
                            <div className="text-sm text-red-600">
                              Sale: {formatPrice(product.salePrice)}
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant="secondary">{product.size}</Badge>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-wrap gap-1 max-w-24">
                        {product.colors?.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                        {product.colors && product.colors.length > 3 && (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs">
                            +{product.colors.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-wrap gap-1">
                        {getStatusBadges(product.flags).map((badge, index) => (
                          <Badge
                            key={index}
                            variant={badge.variant}
                            className="text-xs"
                          >
                            {badge.label}
                          </Badge>
                        ))}
                      </div>
                      {product.collections &&
                        product.collections.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {product.collections.length} collection(s)
                          </div>
                        )}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>

                        {/* ✅ Delete with confirmation */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              disabled={deletingProductId === product._id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete "{product.name}"?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The product will
                                be permanently removed from your store.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() =>
                                  handleDeleteProduct(product._id, product.name)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
