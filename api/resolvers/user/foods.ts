import { getWithDefault } from "../../../shared";
import { foodDataService, userDataService } from "../../dataServices";
import { UserResolvers } from "../../generated";

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
};
