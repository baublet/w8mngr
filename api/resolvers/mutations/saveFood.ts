import { MutationResolvers } from "../../graphql-types";
import { foodDataService } from "../../dataServices";
import { assertIsTruthy } from "shared";
import { foodPermissionService } from "../../permissionsServices";

export const saveFood: MutationResolvers["saveFood"] = async (
  parent,
  { input },
  context
) => {
  await foodPermissionService.assert("createFood", context);

  const userId = context.currentUser?.id;
  assertIsTruthy(userId);

  const newFood = await foodDataService.create(context, {
    userId,
    description: input.description,
    name: input.name,
  });

  return {
    food: newFood,
  };
};
