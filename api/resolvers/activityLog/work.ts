import { activityDataService } from "../../dataServices/activity/index.js";
import { ActivityLogResolvers, ActivityType } from "../../generated.js";
import { numberToContextualUnit } from "../../helpers/numberToContextualUnit.js";

export const activityLogWork: ActivityLogResolvers["work"] = async (
  parent,
  args,
  context,
) => {
  const parentWork: number | undefined = parent.work as any;

  if (!parentWork) {
    return parentWork;
  }

  const requestedWorkUnit = args.unit;

  const activity = await activityDataService.findOneOrFail(
    context,
    parent.activityId,
  );

  return numberToContextualUnit(context, {
    activityType: activity.type as ActivityType,
    work: parentWork,
    requestedWorkUnit,
  });
};
