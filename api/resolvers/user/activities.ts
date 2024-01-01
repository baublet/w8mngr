import { getWithDefault } from "../../../shared/getWithDefault.js";
import { activityDataService } from "../../dataServices/activity/index.js";
import { userDataService } from "../../dataServices/user/index.js";
import { UserResolvers } from "../../generated.js";

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
      query = query.where("userId", "in", [
        currentUserId,
        ...adminUsers.map((u) => u.id),
      ]);
      const searchString = input?.filter?.searchString;
      if (searchString) {
        query = query.where("name", "ilike", searchString);
      }
      return query;
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
