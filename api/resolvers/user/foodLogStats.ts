import { foodLogDataService } from "../../dataServices/foodLog";
import { UserResolvers } from "../../generated";

export const userFoodLogStats: UserResolvers["foodLogStats"] = async (
  parent,
  args,
  context
) => {
  return foodLogDataService.stats(context, {
    userId: parent.id,
    ...args,
  });
};
