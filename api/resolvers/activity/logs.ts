import { ActivityResolvers } from "../../graphql-types";
import { activityLogDataService } from "../../dataServices";
import { dayStringFromDate } from "../../../shared";

export const activityLogs: ActivityResolvers["logs"] = (
  parent,
  args,
  context
) => {
  const day = args.day || dayStringFromDate(new Date());
  const userId = context.currentUser?.id;
  const activityId = parent.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

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
