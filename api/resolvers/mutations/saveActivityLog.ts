import { log } from "../../config/log.js";
import { activityLogDataService } from "../../dataServices/activityLog/index.js";
import { MutationResolvers } from "../../generated.js";

export const saveActivityLog: MutationResolvers["saveActivityLog"] = async (
  parent,
  args,
  context
) => {
  const userId = context.getCurrentUserId(true);

  const mutationResult = await activityLogDataService.saveMutation(context, {
    activityId: args.input.activityId,
    day: args.input.day,
    userId,
    input: args.input.activityLogs,
  });

  if (mutationResult instanceof Error) {
    log(context, "error", "Unexpected error saving activity log", { mutationResult });
    return {
      errors: [mutationResult.message],
    };
  }

  return {
    errors: [],
    logs: activityLogDataService.getConnection(context, {
      constraint: {
        day: args.input.day,
        activityId: args.input.activityId,
        userId,
      },
      additionalRootResolvers: {
        day: args.input.day,
      },
    }),
  };
};
