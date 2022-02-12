import { activityDataService } from "../../dataServices";
import { UserResolvers } from "../../generated";

export const popularUserActivities: UserResolvers["popularActivities"] = (
  parent,
  args,
  context
) => {
  return activityDataService.popular(context);
};
