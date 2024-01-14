import { foodDataService } from "../dataServices/food/index.js";
import { userDataService } from "../dataServices/user/index.js";
import { QueryResolvers } from "../generated.js";
import { globalInMemoryCache } from "../helpers/globalInMemoryCache.js";

export const searchFoods: QueryResolvers["searchFoods"] = async (
  parent,
  { input },
  context,
) => {
  const searchTerm = input.searchTerm;

  if (searchTerm.length < 3) {
    return [];
  }

  const currentUserId = context.getCurrentUserId();
  const adminUsers = await userDataService.getAdminUsers(context);
  const page = input.page || 0;
  const userIds = currentUserId
    ? [currentUserId, ...adminUsers.map((u) => u.id)]
    : adminUsers.map((u) => u.id);

  return globalInMemoryCache.getOrSet({
    key: {
      key: "food-search",
      currentUserId,
      page,
      searchTerm,
    },
    fn: async () => {
      const foods = await foodDataService.findBy(context, (q) =>
        q
          .where("userId", "in", userIds)
          .where("name", "like", `%${searchTerm}%`),
      );
      return foods.map((f) => ({
        ...f,
        description: f.description || undefined,
      }));
    },
  });
};
