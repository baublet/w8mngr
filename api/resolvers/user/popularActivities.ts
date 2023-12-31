import { activityDataService } from "../../dataServices/activity/index.js";
import { UserResolvers, ActivityType } from "../../generated.js";

export const userPopularActivities: UserResolvers["popularActivities"] = async (
  parent,
  args,
  context
) => {
  const popularActivities = await activityDataService.popular(context);
  return popularActivities.map((a) => ({
    ...a,
    createdAt: a.createdAt || Date.now(),
    updatedAt: a.updatedAt || Date.now(),
    description: a.description || undefined,
    exrx: a.exrx || undefined,
    intensity: a.intensity || 0,
    type: (a.type || "WEIGHT") as ActivityType,
  }));
};
