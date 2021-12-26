import { activityDataService } from "../../dataServices";
import { ActivityLogResolvers } from "../../graphql-types";
import { numberToContextualUnit } from "../../helpers";

export const activityLogWork: ActivityLogResolvers["work"] = async (
  parent,
  args,
  context
) => {
  const parentWork: number | undefined = parent.work as any;

  if (!parentWork) {
    return parentWork;
  }

  const requestedWorkUnit = args.unit;

  const activity = await activityDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", parent.activityId)
  );

  return numberToContextualUnit(context, {
    activityType: activity.type,
    work: parentWork,
    requestedWorkUnit,
  });
};
