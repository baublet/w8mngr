import { weightLogDataService } from "../../dataServices/weightLog";
import { UserResolvers } from "../../generated";

export const weightLog: UserResolvers["weightLog"] = async (
  parent,
  args,
  context
) => {
  const log = await weightLogDataService.getConnection(context, {
    constraint: {
      day: args.day,
      userId: context.getCurrentUserId(),
    },
    additionalRootResolvers: {
      day: args.day,
    },
  });

  return {
    ...log,
    day: args.day,
  };
};
