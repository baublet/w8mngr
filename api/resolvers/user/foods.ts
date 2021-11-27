import { getWithDefault } from "../../../shared";
import { foodDataService } from "../../dataServices";
import { UserResolvers } from "../../graphql-types";

export const foods: UserResolvers["foods"] = async (
  parent,
  { input = {} },
  context
) => {
  const filters = getWithDefault(input?.filter, {});
  const connectionResolver = await foodDataService.getConnection(context, {
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
        id: "asc",
      },
    },
  });

  if (connectionResolver instanceof Error) {
    throw connectionResolver;
  }

  return connectionResolver;
};
