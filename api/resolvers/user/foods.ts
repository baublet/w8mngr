import { foodDataService } from "../../dataServices";
import { UserResolvers } from "../../graphql-types";

export const foods: UserResolvers["foods"] = async (
  parent,
  { input = {} },
  context
) => {
  return foodDataService.getConnection(context, {
    constraint: {
      userId: context.currentUser?.id,
    },
    connectionResolverParameters: {
      after: input?.after,
      before: input?.before,
      last: input?.last,
      first: input?.first,
    },
  });
};
