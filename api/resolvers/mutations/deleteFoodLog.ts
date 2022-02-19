import { foodLogDataService } from "../../dataServices";
import { MutationResolvers } from "../../generated";
import { foodLogPermissionService } from "../../permissionsServices";

export const deleteFoodLog: MutationResolvers["deleteFoodLog"] = async (
  parent,
  { input },
  context
) => {
  const permissions = context.services.get(foodLogPermissionService);
  await permissions.assert("delete", input.id);

  const userId = context.getCurrentUserId(true);

  const foodLog = await foodLogDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", input.id).andWhere("userId", "=", userId)
  );
  await foodLogDataService.deleteBy(context, (q) =>
    q.where("id", "=", foodLog.id)
  );

  const logs = await foodLogDataService.getConnection(context, {
    constraint: {
      day: foodLog.day,
    },
    additionalRootResolvers: {
      day: foodLog.day,
    },
  });

  return {
    errors: [],
    logs,
  };
};
