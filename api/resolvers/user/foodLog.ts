import { foodLogDataService } from "../../dataServices/foodLog/index.js";
import { UserResolvers } from "../../generated.js";

export const foodLog: UserResolvers["foodLog"] = async (
  parent,
  args,
  context,
) => {
  const log = await foodLogDataService.getConnection(context, {
    constraint: { day: args.day, userId: parent.id },
  });

  return {
    ...log,
    day: args.day,
  };
};
