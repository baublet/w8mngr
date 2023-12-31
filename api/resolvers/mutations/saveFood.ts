import { foodDataService } from "../../dataServices/food/index.js";
import { MutationResolvers } from "../../generated.js";
import { foodPermissionService } from "../../permissionsServices/food.js";

export const saveFood: MutationResolvers["saveFood"] = async (
  parent,
  { input },
  context
) => {
  const permissions = context.services.get(foodPermissionService);
  await permissions.assert("createFood");

  const userId = context.getCurrentUserId(true);

  return foodDataService.saveMutation(context, {
    input,
    userId,
  });
};
