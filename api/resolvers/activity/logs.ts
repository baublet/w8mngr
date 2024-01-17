import { dayStringFromDate } from "../../../shared/dayStringFromDate.js";
import { activityLogDataService } from "../../dataServices/activityLog/index.js";
import { ActivityResolvers } from "../../generated.js";

export const activityLogs: ActivityResolvers["logs"] = async (
  parent,
  args,
  context,
) => {
  const day = args.day || dayStringFromDate(new Date());
  const userId = context.getCurrentUserId(true);
  const activityId = parent.id;

  const connection = await activityLogDataService.getConnection(context, {
    applyCustomConstraint: (q) =>
      q
        .where("userId", "=", userId)
        .where("day", "=", day)
        .where("activityId", "=", activityId),
    additionalRootResolvers: {
      day,
    },
  });

  if (connection instanceof Error) {
    throw connection;
  }

  return connection;
};
