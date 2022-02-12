import { foodLogDataService } from "../../dataServices";
import { UserResolvers } from "../../generated";

export const foodLog: UserResolvers["foodLog"] = async (
  parent,
  args,
  context
) => {
  const log = await foodLogDataService.getConnection(context, {
    constraint: { day: args.day, userId: parent.id },
  });

  return {
    ...log,
    day: args.day,
  };
};
