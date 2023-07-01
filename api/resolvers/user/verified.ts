import { UserResolvers } from "../../generated";
import { userAccountDataService } from "../../dataServices/userAccount";
import { globalInMemoryCache } from "../../helpers/globalInMemoryCache";

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
            .where("source", "=", "local")
            .where("verified", "=", 1)
      );

      return userVerifiedAccounts.length > 0;
    },
  });
};
