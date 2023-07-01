import { assertIsTruthy } from "../../../shared";
import type { ActivityLog } from "../../dataServices/activityLog";
import { activityDataService } from "../../dataServices/activity";
import { ActivityLogResolvers } from "../../generated";

export const activityLogActivity: ActivityLogResolvers["activity"] = (
  parent,
  args,
  context
) => {
  const activityId = (parent as any as ActivityLog).activityId;
  assertIsTruthy(activityId);

  return activityDataService.findOneOrFail(context, activityId);
};
