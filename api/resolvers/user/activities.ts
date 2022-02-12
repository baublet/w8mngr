import { getWithDefault } from "../../../shared";
import { activityDataService } from "../../dataServices";
import { userDataService } from "../../dataServices";
import { UserResolvers } from "../../generated";

export const activities: UserResolvers["activities"] = async (
  parent,
  { input = {} },
  context
) => {
  const filters = getWithDefault(input?.filter, {});
  const currentUserId = parent.id;
  const adminUsers = await userDataService.getAdminUsers(context);
  const connectionResolver = await activityDataService.getConnection(context, {
    applyCustomConstraint: (query) => {
      query.whereIn("userId", [currentUserId, ...adminUsers.map((u) => u.id)]);
      const searchString = input?.filter?.searchString;
      if (searchString) {
        query.andWhereRaw("UPPER(name) LIKE ?", [
          "%" + searchString.toUpperCase() + "%",
        ]);
      }
    },
    constraint: {
      id: filters.id,
    },
    connectionResolverParameters: {
      after: input?.after,
      before: input?.before,
      last: input?.last,
      first: input?.first,
      sort: {
        name: "asc",
      },
    },
  });

  if (connectionResolver instanceof Error) {
    throw connectionResolver;
  }

  return connectionResolver;
};
