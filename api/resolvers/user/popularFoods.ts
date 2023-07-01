import { foodDataService } from "../../dataServices/food";
import { UserResolvers } from "../../generated";

export const userPopularFoods: UserResolvers["popularFoods"] = (
  parent,
  args,
  context
) => {
  return foodDataService.popular(context);
};
