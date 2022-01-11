import { MutationResolvers } from "../../graphql-types";
import { activityLogDataService } from "../../dataServices";
import { Unauthorized } from "../../helpers/errors/Unauthorized";
import { log } from "../../config";

export const deleteActivityLog: MutationResolvers["deleteActivityLog"] = async (
  parent,
  args,
  context
) => {
  const userId = context.getCurrentUserId(true);
  const activityLog = await activityLogDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", args.input.id)
  );
  await activityLogDataService.deleteBy(context, (q) =>
    q.where("id", "=", activityLog.id).andWhere("userId", "=", userId)
  );

  return {
    errors: [],
    logs: activityLogDataService.getConnection(context, {
      constraint: {
        day: activityLog.day,
        activityId: activityLog.activityId,
        userId,
      },
      additionalRootResolvers: {
        day: activityLog.day,
      },
    }),
  };
};
