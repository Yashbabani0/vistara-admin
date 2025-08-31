import { query } from "./_generated/server";

export const getCollections = query({
  handler: async (ctx) => {
    const collections = await ctx.db.query("collections").collect();
    return collections;
  },
});
