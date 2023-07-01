import { activityLogDataService } from "../../dataServices/activityLog";
import { MutationResolvers } from "../../generated";

export const deleteActivityLog: MutationResolvers["deleteActivityLog"] = async (
  parent,
  args,
  context
) => {
  const userId = context.getCurrentUserId(true);
  const activityLog = await activityLogDataService.findOneOrFailBy(
    context,
    (q) => q.where("id", "=", args.input.id).where("userId", "=", userId)
  );
  await activityLogDataService.deleteBy(context, (q) =>
    q.where("id", "=", activityLog.id).where("userId", "=", userId)
  );

  return {
    errors: [],
    logs: await activityLogDataService.getConnection(context, {
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
