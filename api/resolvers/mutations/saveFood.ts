import { foodDataService } from "../../dataServices/food";
import { MutationResolvers } from "../../generated";
import { foodPermissionService } from "../../permissionsServices/food";

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
