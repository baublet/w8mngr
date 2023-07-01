import { dayStringFromDate } from "../../../shared";
import { activityLogDataService } from "../../dataServices/activityLog";
import { ActivityResolvers } from "../../generated";

export const activityLogs: ActivityResolvers["logs"] = (
  parent,
  args,
  context
) => {
  const day = args.day || dayStringFromDate(new Date());
  const userId = context.getCurrentUserId(true);
  const activityId = parent.id;

  const connection = activityLogDataService.getConnection(context, {
    applyCustomConstraint: (q) =>
      q
        .where("userId", "=", userId)
        .andWhere("day", "=", day)
        .andWhere("activityId", "=", activityId),
    additionalRootResolvers: {
      day,
    },
  });

  if (connection instanceof Error) {
    throw connection;
  }

  return connection;
};
