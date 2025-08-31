// convex/functions/products/createProduct.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createProduct = mutation({
  args: {
    product: v.any(),
  },
  handler: async (ctx, { product }) => {
    const id = await ctx.db.insert("products", {
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      images: product.images ?? [],
      size: product.size ?? null,
      colors: product.colors ?? [],
      category: product.category ?? null,
      collections: product.collections ?? [],
      basePrice: product.price ?? null,
      salePrice: product.salePrice ?? null,
      flags: product.flags ?? {},
    });

    return id;
  },
});
