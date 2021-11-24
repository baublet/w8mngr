import { MutationResolvers } from "../../graphql-types";
import { foodLogDataService } from "../../dataServices";
import { assertIsTruthy } from "shared";
import { foodLogPermissionService } from "../../permissionsServices";

export const deleteFoodLog: MutationResolvers["deleteFoodLog"] = async (
  parent,
  { input },
  context
) => {
  await foodLogPermissionService.assert("delete", context, input.id);

  const userId = context.currentUser?.id;
  assertIsTruthy(userId);

  const foodLog = await foodLogDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", input.id).andWhere("userId", "=", userId)
  );
  await foodLogDataService.deleteByIds(context, [foodLog.id]);

  const log = await foodLogDataService.getConnection(context, {
    day: foodLog.day,
  });

  return {
    day: foodLog.day,
    ...log,
  };
};
