import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});