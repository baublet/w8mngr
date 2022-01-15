import { MutationResolvers } from "../../graphql-types";
import { activityLogDataService } from "../../dataServices";

export const deleteActivityLog: MutationResolvers["deleteActivityLog"] = async (
  parent,
  args,
  context
) => {
  const userId = context.getCurrentUserId(true);
  const activityLog = await activityLogDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", args.input.id).andWhere("userId", "=", userId)
  );
  await activityLogDataService.deleteBy(context, (q) =>
    q.where("id", "=", activityLog.id).andWhere("userId", "=", userId)
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
