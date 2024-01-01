import { getWithDefault } from "../../../shared/getWithDefault.js";
import { foodDataService } from "../../dataServices/food/index.js";
import { userDataService } from "../../dataServices/user/index.js";
import { UserResolvers } from "../../generated.js";

export const foods: UserResolvers["foods"] = async (
  parent,
  { input = {} },
  context
) => {
  const currentUserId = parent.id;
  const adminUsers = await userDataService.getAdminUsers(context);
  const filters = getWithDefault(input?.filter, {});
  const connectionResolver = await foodDataService.getConnection(context, {
    applyCustomConstraint: (q) =>
      q.where("userId", "in", [currentUserId, ...adminUsers.map((u) => u.id)]),
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
};
