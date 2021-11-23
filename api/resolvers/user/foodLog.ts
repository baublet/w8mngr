import { foodLogDataService } from "../../dataServices";
import { UserResolvers } from "../../graphql-types";

export const foodLog: UserResolvers["foodLog"] = async (
  parent,
  args,
  context
) => {
  const log = await foodLogDataService.getConnection(context, {
    day: args.day,
  });

  return {
    ...log,
    day: args.day,
  };
};
