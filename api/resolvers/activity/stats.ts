import { activityDataService } from "../../dataServices";
import { ActivityResolvers } from "../../graphql-types";

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
