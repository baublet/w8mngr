import { foodDataService, userDataService } from "../dataServices";
import { QueryResolvers } from "../graphql-types";
import { globalInMemoryCache } from "../helpers";

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
      const algoliaResults = await foodDataService.searchRecordsInAlgolia(
        context,
        {
          searchTerm,
          filters: userIds.map((userId) => `userId:${userId}`).join(" OR "),
        }
      );

      if (algoliaResults.length) {
        return algoliaResults;
      }

      return foodDataService.findBy(context, (q) =>
        q.whereIn("userId", userIds).andWhere("name", "like", `%${searchTerm}%`)
      );
    },
  });
};
