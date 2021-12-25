import { assertIsTruthy } from "../../../shared";
import { activityDataService, ActivityLog } from "../../dataServices";
import { ActivityLogResolvers } from "../../graphql-types";

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
