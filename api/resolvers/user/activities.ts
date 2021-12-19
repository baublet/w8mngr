import { getWithDefault } from "../../../shared";
import { activityDataService } from "../../dataServices";
import { UserResolvers } from "../../graphql-types";

export const activities: UserResolvers["activities"] = async (
  parent,
  { input = {} },
  context
) => {
  const filters = getWithDefault(input?.filter, {});
  const connectionResolver = await activityDataService.getConnection(context, {
    applyCustomConstraint: (query) => {
      const searchString = input?.filter?.searchString;
      if (searchString) {
        query.andWhereRaw("UPPER(name) LIKE ?", [
          "%" + searchString.toUpperCase() + "%",
        ]);
      }
    },
    constraint: {
      userId: context.currentUser?.id,
      id: filters.id,
    },
    connectionResolverParameters: {
      after: input?.after,
      before: input?.before,
      last: input?.last,
      first: input?.first,
      sort: {
        name: "asc",
        id: "asc",
      },
    },
  });

  if (connectionResolver instanceof Error) {
    throw connectionResolver;
  }

  return connectionResolver;
};
