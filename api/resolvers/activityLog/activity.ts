import { assertIsTruthy } from "../../../shared";
import { ActivityLog, activityDataService } from "../../dataServices";
import { ActivityLogResolvers } from "../../generated";

export const activityLogActivity: ActivityLogResolvers["activity"] = (
  parent,
  args,
  context
) => {
  const activityId = (parent as any as ActivityLog).activityId;
  assertIsTruthy(activityId);

  return activityDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", activityId)
  );
};
