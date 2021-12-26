import { activityDataService } from "../../dataServices";
import { UserResolvers } from "../../graphql-types";

export const popularUserActivities: UserResolvers["popularActivities"] = (
  parent,
  args,
  context
) => {
  return activityDataService.popular(context);
};
