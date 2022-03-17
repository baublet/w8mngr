import { FoodLogEntity, foodLogDataService } from "../../dataServices";
import { foodLogFoodDataService } from "../../dataServices/foodLogFood";
import { MutationResolvers } from "../../generated";
import { foodLogPermissionService } from "../../permissionsServices";

export const saveFoodLog: MutationResolvers["saveFoodLog"] = async (
  parent,
  { input },
  context
) => {
  const permissions = context.services.get(foodLogPermissionService);
  await permissions.assert("create");

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
  await foodLogDataService.upsert(context, items);

  await foodLogFoodDataService.upsert(
    context,
    input.foodLogs
      .filter((log) => Boolean(log.foodId))
      .map((log) => ({
        day,
        foodId: log.foodId,
        id: log.id,
        userId: context.getCurrentUserId(true),
      }))
  );

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
