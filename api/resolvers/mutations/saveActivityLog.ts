import { MutationResolvers } from "../../graphql-types";
import { activityLogDataService } from "../../dataServices";
import { log } from "../../config";

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
    log("error", "Unexpected error saving activity log", { mutationResult });
    return {
      error: [mutationResult.message],
    };
  }

  return {
    error: [],
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
