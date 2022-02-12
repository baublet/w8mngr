import { assertIsTruthy } from "../../../shared";
import { foodDataService } from "../../dataServices";
import { MutationResolvers } from "../../generated";
import { foodPermissionService } from "../../permissionsServices";

export const saveFood: MutationResolvers["saveFood"] = async (
  parent,
  { input },
  context
) => {
  await foodPermissionService.assert("createFood", context);

  const userId = context.getCurrentUserId(true);

  return foodDataService.saveMutation(context, {
    input,
    userId,
  });
};
