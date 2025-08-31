// app/dashboard/products/add/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  UploadResponse,
} from "@imagekit/next";

interface Color {
  name: string;
  hex: string;
}

export default function Page() {
  const [productName, setProductName] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: number]: number;
  }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [size, setSize] = useState("");
  const [colors, setColors] = useState<Color[]>([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = useQuery(api.categories.getCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const collections = useQuery(api.collections.getCollections);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [showPrice, setShowPrice] = useState<number>();
  const [realPrice, setRealPrice] = useState<number>();
  const [flags, setFlags] = useState({
    isActive: false,
    isFastSelling: false,
    isOnSale: false,
    isNewArrival: false,
    isLimitedEdition: false,
  });
  const createProduct = useMutation(api.createProduct.createProduct);

  // Authentication function for ImageKit
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  // File handling
  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(
      (file) => file.type === "image/webp"
    );

    if (newFiles.length !== files.length) {
      alert("Only .webp images are allowed!");
    }

    const updatedFiles = [...images, ...newFiles];
    setImages(updatedFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Upload single image to ImageKit
  const uploadSingleImage = async (
    file: File,
    index: number
  ): Promise<string> => {
    try {
      const authParams = await authenticator();
      const { signature, expire, token, publicKey } = authParams;

      if (!signature || !expire || !token || !publicKey) {
        throw new Error("Missing authentication parameters");
      }

      if (!file) {
        throw new Error("No file selected");
      }

      console.log("Uploading file:", file.name);
      console.log("Authentication parameters:", authParams);

      const uploadResponse: UploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        folder: "/products",
        useUniqueFileName: true,
        onProgress: (event) => {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress((prev) => ({
            ...prev,
            [index]: progress,
          }));
        },
      });

      if (!uploadResponse.url) {
        throw new Error("Upload did not return a URL");
      }

      return uploadResponse.url;
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);

      if (error instanceof ImageKitAbortError) {
        throw new Error(`Upload aborted: ${error.reason}`);
      } else if (error instanceof ImageKitInvalidRequestError) {
        throw new Error(`Invalid request: ${error.message}`);
      } else if (error instanceof ImageKitUploadNetworkError) {
        throw new Error(`Network error: ${error.message}`);
      } else if (error instanceof ImageKitServerError) {
        throw new Error(`Server error: ${error.message}`);
      } else {
        throw new Error(`Upload failed: ${error}`);
      }
    }
  };

  // Upload all images
  const handleImageUpload = async () => {
    if (images.length === 0) {
      alert("Please select images to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress({});

    try {
      const uploadPromises = images.map((file, index) =>
        uploadSingleImage(file, index)
      );

      const urls = await Promise.all(uploadPromises);
      setUploadedUrls(urls);

      // Clear the progress after successful upload
      setUploadProgress({});

      alert("All images uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove uploaded image
  const removeUploadedImage = (index: number) => {
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Colors
  const addColor = () => {
    if (!colorName.trim()) {
      alert("Please enter a color name.");
      return;
    }
    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(colorHex);
    if (!isValidHex) {
      alert("Enter a valid hex code (e.g., #000000 or #FFF)");
      return;
    }
    setColors((prev) => [...prev, { name: colorName.trim(), hex: colorHex }]);
    setColorName("");
    setColorHex("");
  };

  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  // Collections
  const toggleCollection = (id: string) => {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Flags
  const toggleFlag = (key: keyof typeof flags) => {
    setFlags((prev) => {
      const currentlyActive = Object.values(prev).filter(Boolean).length;
      if (!prev[key] && currentlyActive >= 3) {
        alert("You can only select up to 3 flags at a time.");
        return prev;
      }
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Ensure images are uploaded to ImageKit first
      if (uploadedUrls.length === 0 && images.length > 0) {
        // Upload first if user hasn't clicked "Upload Images"
        await handleImageUpload();
      }

      // Simple validation
      if (!productName.trim()) {
        alert("Please enter a product name.");
        return;
      }
      if (!productSlug.trim()) {
        alert("Please enter a product slug.");
        return;
      }
      if (!uploadedUrls.length) {
        alert("Please upload at least one product image.");
        return;
      }

      const productPayload = {
        name: productName.trim(),
        slug: productSlug.trim(),
        description: productDescription.trim(),
        images: uploadedUrls, // array of ImageKit public URLs (string[])
        size: size || null,
        colors, // Color[] e.g., [{name, hex}, ...]
        category: selectedCategory,
        collections: selectedCollections,
        price: showPrice ?? null,
        salePrice: realPrice ?? null,
        flags,
      };

      // Call Convex mutation to create the product record
      const insertedId = await createProduct({ product: productPayload });

      // insertedId may be an object/Id depending on your Convex setup; stringify for display
      console.log("Created product ID:", insertedId);

      // Simple success UI
      alert("Product created successfully.");

      // Reset form or redirect as desired
      // setProductName("");
      // setProductSlug("");
      // setProductDescription("");
      // setImages([]);
      // setPreviewUrls([]);
      // setUploadedUrls([]);
      // setSize("");
      // setColors([]);
      // setSelectedCategory(null);
      // setSelectedCollections([]);
      // setShowPrice(undefined);
      // setRealPrice(undefined);
      // setFlags({
      //   isActive: false,
      //   isFastSelling: false,
      //   isOnSale: false,
      //   isNewArrival: false,
      //   isLimitedEdition: false,
      // });
    } catch (err) {
      console.error("Failed to create product:", err);
      alert(`Failed to add product: ${err}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-lg xl:max-w-2xl mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col xl:flex-row gap-6">
          <div>
            {/* Product Name */}
            <section className="mb-4">
              <Label htmlFor="productName" className="mb-2 block font-semibold">
                Product Name
              </Label>
              <Input
                type="text"
                id="productName"
                name="productName"
                placeholder="Product Name"
                maxLength={100}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </section>

            {/* Product Slug */}
            <section className="mb-4">
              <Label htmlFor="productSlug" className="mb-2 block font-semibold">
                Product Slug
              </Label>
              <Input
                type="text"
                id="productSlug"
                name="productSlug"
                placeholder="Product Slug"
                maxLength={100}
                value={productSlug}
                onChange={(e) => setProductSlug(e.target.value)}
                required
              />
            </section>

            {/* Product Description */}
            <section className="mb-4">
              <Label
                htmlFor="productDescription"
                className="mb-2 block font-semibold"
              >
                Product Description
              </Label>
              <Textarea
                id="productDescription"
                name="productDescription"
                placeholder="Product Description"
                maxLength={500}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                required
              />
            </section>

            {/* Product Images */}
            <section className="mb-4">
              <Label
                htmlFor="productImage"
                className="mb-2 block font-semibold"
              >
                Product Images (.webp only)
              </Label>
              <Input
                ref={fileInputRef}
                type="file"
                id="productImage"
                name="productImage"
                accept="image/webp"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
              />
              <Button
                type="button"
                onClick={handleImageUpload}
                disabled={images.length === 0 || isUploading}
                className="mt-2 bg-black text-white disabled:bg-gray-400"
              >
                {isUploading ? "Uploading..." : "Upload Images"}
              </Button>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-2 space-y-2">
                  {Object.entries(uploadProgress).map(([index, progress]) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm">
                        Image {parseInt(index) + 1}:
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm">{Math.round(progress)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Local Previews */}
            {previewUrls.length > 0 && !uploadedUrls.length && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <h3 className="col-span-2 font-semibold text-sm">
                  Local Previews:
                </h3>
                {previewUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            )}

            {/* Uploaded Images */}
            {uploadedUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <h3 className="col-span-2 font-semibold text-sm text-green-600">
                  Uploaded Images ({uploadedUrls.length}):
                </h3>
                {uploadedUrls.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={url}
                      alt="Uploaded"
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeUploadedImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Product Size */}
            <section className="mb-4">
              <Label htmlFor="productSize" className="mb-2 block font-semibold">
                Product Size
              </Label>
              <Input
                type="text"
                id="productSize"
                name="productSize"
                placeholder="e.g., S, M, L, XL"
                maxLength={50}
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </section>
          </div>

          <div>
            {/* Product Colors */}
            <section>
              <Label className="mb-2 block font-semibold">Product Colors</Label>
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Color name (e.g., Black)"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="#000000"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-28"
                />
                <Button type="button" onClick={addColor}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 border rounded-lg px-3 py-2 shadow-sm bg-white"
                  >
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="flex flex-col">
                      <span className="capitalize font-medium">{c.name}</span>
                      <span className="text-xs text-gray-500">{c.hex}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Product Category */}
            <section className="mb-4">
              <Label
                htmlFor="productCategory"
                className="mb-2 block font-semibold"
              >
                Product Category
              </Label>
              <Select
                onValueChange={(value) => setSelectedCategory(value)}
                value={selectedCategory ?? undefined}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {categories?.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {selectedCategory && (
                <p className="text-sm mt-2">
                  Selected ID: <strong>{selectedCategory}</strong>
                </p>
              )}
            </section>

            {/* Product Collection */}
            <section className="mb-4">
              <Label
                htmlFor="productCollection"
                className="mb-2 block font-semibold"
              >
                Product Collections
              </Label>
              <div className="space-y-2 max-h-48 overflow-y-auto border p-4 rounded">
                {collections?.map((collection) => (
                  <div
                    key={collection._id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={collection._id}
                      checked={selectedCollections.includes(collection._id)}
                      onChange={() => toggleCollection(collection._id)}
                    />
                    <label htmlFor={collection._id}>{collection.name}</label>
                  </div>
                ))}
              </div>
            </section>

            {/* Product Price */}
            <section className="flex gap-4 items-center justify-center mb-4">
              <div>
                <Label
                  htmlFor="productPrice"
                  className="mb-2 block font-semibold"
                >
                  Product Price
                </Label>
                <Input
                  type="number"
                  id="productPrice"
                  name="productPrice"
                  placeholder="e.g., 19.99"
                  value={showPrice}
                  onChange={(e) => setShowPrice(e.target.valueAsNumber)}
                  onBlur={() => {
                    if (showPrice !== undefined && !isNaN(showPrice)) {
                      setShowPrice(parseFloat(showPrice.toFixed(2)));
                    }
                  }}
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="productDiscountedPrice"
                  className="mb-2 block font-semibold"
                >
                  Product Discounted Price
                </Label>
                <Input
                  type="number"
                  id="productDiscountedPrice"
                  name="productDiscountedPrice"
                  placeholder="e.g., 19.99"
                  value={realPrice}
                  onChange={(e) => setRealPrice(e.target.valueAsNumber)}
                  onBlur={() => {
                    if (realPrice !== undefined && !isNaN(realPrice)) {
                      setRealPrice(parseFloat(realPrice.toFixed(2)));
                    }
                  }}
                />
              </div>
            </section>

            {/* Product Flags */}
            <section className="p-4 rounded-2xl border shadow-sm space-y-3 mb-4">
              <h3 className="text-lg font-semibold">Product Flags</h3>
              <div className="space-y-2">
                {Object.keys(flags).map((key) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={flags[key as keyof typeof flags]}
                      onChange={() => toggleFlag(key as keyof typeof flags)}
                      className="h-4 w-4 accent-black"
                    />
                    <Label htmlFor={key} className="capitalize">
                      {key.replace("is", "").replace(/([A-Z])/g, " $1")}
                    </Label>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={uploadedUrls.length === 0}
        >
          Add Product
        </Button>
      </form>
    </div>
  );
}
