import { foodLogDataService } from "../../dataServices/foodLog/index.js";
import { UserResolvers } from "../../generated.js";

export const userFoodLogStats: UserResolvers["foodLogStats"] = async (
  parent,
  args,
  context,
) => {
  return foodLogDataService.stats(context, {
    userId: parent.id,
    ...args,
  });
};
