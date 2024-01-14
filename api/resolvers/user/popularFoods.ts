import { foodDataService } from "../../dataServices/food/index.js";
import { UserResolvers } from "../../generated.js";

export const userPopularFoods: UserResolvers["popularFoods"] = async (
  parent,
  args,
  context,
) => {
  const foods = await foodDataService.popular(context);
  return foods.map((f) => ({
    ...f,
    description: f.description || undefined,
  }));
};
