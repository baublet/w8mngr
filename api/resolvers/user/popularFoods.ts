import { foodDataService } from "../../dataServices/food";
import { UserResolvers } from "../../generated";

export const userPopularFoods: UserResolvers["popularFoods"] = async (
  parent,
  args,
  context
) => {
  const foods = await foodDataService.popular(context);
  return foods.map((f) => ({
    ...f,
    description: f.description || undefined,
  }));
};
