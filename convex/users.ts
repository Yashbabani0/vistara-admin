import { query } from "./_generated/server";

export const getUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user._creationTime,
      image: user.image,
      role: user.role,
    }));
  },
});
