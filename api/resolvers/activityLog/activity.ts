import { assertIsTruthy } from "../../../shared/assertIsTruthy.js";
import type { ActivityLog } from "../../dataServices/activityLog/index.js";
import { activityDataService } from "../../dataServices/activity/index.js";
import type { ActivityLogResolvers } from "../../generated.js";

export const activityLogActivity: ActivityLogResolvers["activity"] = (
  parent,
  args,
  context
) => {
  const activityId = (parent as any as ActivityLog).activityId;
  assertIsTruthy(activityId);

  return activityDataService.findOneOrFail(context, activityId);
};
