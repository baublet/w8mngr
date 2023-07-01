import { activityDataService } from "../../dataServices/activity";
import { UserResolvers } from "../../generated";

export const userPopularActivities: UserResolvers["popularActivities"] = (
  parent,
  args,
  context
) => {
  return activityDataService.popular(context);
};
