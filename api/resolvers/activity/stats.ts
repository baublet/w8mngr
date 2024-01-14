import { activityDataService } from "../../dataServices/activity/index.js";
import { ActivityResolvers } from "../../generated.js";

export const activityStats: ActivityResolvers["stats"] = async (
  parent,
  args,
  context,
) => {
  const userId = context.getCurrentUserId(true);

  return activityDataService.stats(context, {
    userId,
    activityId: parent.id,
  });
};
