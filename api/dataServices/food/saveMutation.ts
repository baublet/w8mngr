import { Context } from "../../createContext";
import { foodDataService } from "./index";
import { FoodInput } from "../../graphql-types";

export async function saveMutation(
  context: Context,
  { input, userId }: { input: FoodInput; userId: string }
) {
  const newFood = await foodDataService.upsert(context, [input], (q) =>
    q.where("userId", "=", userId)
  );

  return {
    food: foodDataService.findOneOrFail(context, (q) =>
      q.where("id", "=", newFood[0].id).andWhere("userId", "=", userId)
    ),
  };
}
