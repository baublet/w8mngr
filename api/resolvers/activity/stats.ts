import { activityDataService } from "../../dataServices/activity";
import { ActivityResolvers } from "../../generated";

export const activityStats: ActivityResolvers["stats"] = async (
  parent,
  args,
  context
) => {
  const userId = context.getCurrentUserId(true);

  return activityDataService.stats(context, {
    userId,
    activityId: parent.id,
  });
};
