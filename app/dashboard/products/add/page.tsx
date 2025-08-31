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
import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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
  const [size, setSize] = useState("");
  const [colors, setColors] = useState<Color[]>([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("");
  const categories = useQuery(api.categories.getCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const handleImageUpload = async () => {
    if (images.length === 0) return;

    const formData = new FormData();
    images.forEach((file) => formData.append("files", file));

    const res = await fetch("/api/upload-imagekit", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploadedUrls(data.urls);
  };

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

  return (
    <div className="flex flex-col min-h-screen w-full max-w-lg mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form className="space-y-6">
        {/* Product Name */}
        <section>
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
          />
        </section>

        {/* Product Slug */}
        <section>
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
          />
        </section>

        {/* Product Description */}
        <section>
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
          />
        </section>

        {/* Product Images */}
        <section>
          <Label htmlFor="productImage" className="mb-2 block font-semibold">
            Product Images (.webp only)
          </Label>
          <Input
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
            className="mt-2 bg-black text-white"
          >
            Upload Images
          </Button>
        </section>

        {/* Local Previews */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
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

        {/* Uploaded (ImageKit) Previews */}
        {uploadedUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {uploadedUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="Uploaded"
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* Product Size */}
        <section>
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

          {/* Preview */}
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
          <Label htmlFor="productCategory" className="mb-2 block font-semibold">
            Product Category
          </Label>
          <Select onValueChange={(value) => setSelectedCategory(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {categories?.map((cat) => (
                  <SelectItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {selectedCategory && (
            <p className="text-sm mt-2">
              Selected: <strong>{selectedCategory}</strong>
            </p>
          )}
        </section>

        {/* Product Collection */}
        
      </form>
    </div>
  );
}
