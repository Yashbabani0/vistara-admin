// convex/collections.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export const getCollections = query({
  handler: async (ctx) => {
    const collections = await ctx.db.query("collections").collect();
    return collections;
  },
});

export const addCollection = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const slug = generateSlug(args.name);
    const id = await ctx.db.insert("collections", {
      name: args.name,
      slug,
    });
    return { success: true, id, slug };
  },
});

export const editCollection = mutation({
  args: {
    id: v.id("collections"),
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

export const deleteCollection = mutation({
  args: { id: v.id("collections") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
