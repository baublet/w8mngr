import { userAccountDataService } from "../../dataServices";
import { UserResolvers } from "../../graphql-types";
import { globalInMemoryCache } from "../../helpers";

export const userVerified: UserResolvers["verified"] = async (
  parent,
  args,
  context
) => {
  const key = `user-${parent.id}-verified`;
  return globalInMemoryCache.getOrSet({
    key,
    expiry: 15000,
    fn: async () => {
      const userVerifiedAccounts = await userAccountDataService.findBy(
        context,
        (q) =>
          q
            .where("userId", "=", parent.id)
            .andWhere("source", "=", "local")
            .andWhere("verified", "=", true)
      );

      return userVerifiedAccounts.length > 0;
    },
  });
};
