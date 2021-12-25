import { activityDataService } from "../../dataServices";
import { ActivityLogResolvers } from "../../graphql-types";
import { workToUnit } from "../../../shared";

export const activityLogWork: ActivityLogResolvers["work"] = async (
  parent,
  args,
  context
) => {
  const parentWork = parent.work;

  if (!parentWork) {
    return parentWork;
  }

  const requestedWorkUnit = args.unit;

  if (!requestedWorkUnit) {
    return parentWork;
  }

  const activity = await activityDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", parent.activityId)
  );

  return workToUnit({
    activityType: activity.type,
    unit: requestedWorkUnit,
    work: parentWork,
  });
};
