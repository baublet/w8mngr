import { getWithDefault } from "../../../shared";
import { foodDataService, userDataService } from "../../dataServices";
import { UserResolvers } from "../../graphql-types";
import { globalInMemoryCache } from "../../helpers";

export const foods: UserResolvers["foods"] = async (
  parent,
  { input = {} },
  context
) => {
  const currentUserId = parent.id;
  const searchString = input?.filter?.searchString;
  const cacheKey = `food-search-${currentUserId}-${JSON.stringify(
    searchString
  )}`;

  return globalInMemoryCache.getOrSet({
    key: cacheKey,
    expiry: 30000,
    fn: async () => {
      const adminUsers = await userDataService.getAdminUsers(context);

      const filters = getWithDefault(input?.filter, {});
      const connectionResolver = await foodDataService.getConnection(context, {
        applyCustomConstraint: (q) =>
          q.whereIn("userId", [currentUserId, ...adminUsers.map((u) => u.id)]),
        constraint: {
          id: filters.id,
        },
        connectionResolverParameters: {
          after: input?.after,
          before: input?.before,
          last: input?.last,
          first: input?.first,
          sort: {
            id: "asc",
          },
        },
      });

      if (connectionResolver instanceof Error) {
        throw connectionResolver;
      }

      return connectionResolver;
    },
  });
};
