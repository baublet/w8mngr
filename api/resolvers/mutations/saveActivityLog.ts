import { MutationResolvers } from "../../graphql-types";
import {
  activityDataService,
  activityLogDataService,
} from "../../dataServices";
import { activityLogs } from "../activity/logs";
import { log } from "../../config";

export const saveActivityLog: MutationResolvers["saveActivityLog"] = async (
  parent,
  args,
  context
) => {
  const userId = context.currentUser?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const activity = await activityDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", args.input.activityId)
  );

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

  return { error: [] };
};
