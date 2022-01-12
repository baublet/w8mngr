import { foodLogDataService } from "../../dataServices/foodLog";
import { UserResolvers } from "../../graphql-types";

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
