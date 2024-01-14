import {
  FoodLogEntity,
  foodLogDataService,
} from "../../dataServices/foodLog/index.js";
import { foodLogFoodDataService } from "../../dataServices/foodLogFood/index.js";
import { MutationResolvers } from "../../generated.js";
import { foodLogPermissionService } from "../../permissionsServices/foodLog.js";

export const saveFoodLog: MutationResolvers["saveFoodLog"] = async (
  parent,
  { input },
  context,
) => {
  const permissions = context.services.get(foodLogPermissionService);
  await permissions.assert("create");

  console.log({ input: JSON.stringify(input) });

  const day = input.day;
  const items: Partial<FoodLogEntity>[] = input.foodLogs.map((log) => ({
    calories: log.calories,
    carbs: log.carbs,
    fat: log.fat,
    id: log.id,
    day,
    userId: context.getCurrentUserId(true),
    protein: log.protein,
    description: log.description,
  }));

  console.log({ items: JSON.stringify(items) });
  await foodLogDataService.upsert(context, items);

  console.log("madei t here");
  await foodLogFoodDataService.upsert(
    context,
    input.foodLogs
      .filter((log) => Boolean(log.foodId))
      .map((log) => ({
        day,
        foodId: log.foodId,
        id: log.id,
        userId: context.getCurrentUserId(true),
      })),
  );

  console.log("madei t here 2");
  const logs = await foodLogDataService.getConnection(context, {
    constraint: {
      day: input.day,
    },
    additionalRootResolvers: {
      day: input.day,
    },
  });

  return {
    errors: [],
    logs,
  };
};
