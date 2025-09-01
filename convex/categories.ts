import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export const getCategories = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories;
  },
});

export const addCategory = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const slug = generateSlug(args.name);
    const id = await ctx.db.insert("categories", {
      name: args.name,
      slug,
    });
    return { success: true, id, slug };
  },
});

export const editCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const slug = generateSlug(args.name);
    await ctx.db.patch(args.id, {
      name: args.name,
      slug,
    });
    return { success: true, slug };
  },
});

export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
