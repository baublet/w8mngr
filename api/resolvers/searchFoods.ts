import { foodDataService } from "../dataServices/food";
import { userDataService } from "../dataServices/user";
import { QueryResolvers } from "../generated";
import { globalInMemoryCache } from "../helpers/globalInMemoryCache";

export const searchFoods: QueryResolvers["searchFoods"] = async (
  parent,
  { input },
  context
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
      return foodDataService.findBy(context, (q) =>
        q
          .where("userId", "in", userIds)
          .where("name", "like", `%${searchTerm}%`)
      );
    },
  });
};
