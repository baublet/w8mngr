import { weightLogDataService } from "../../dataServices";
import { MutationResolvers } from "../../generated";

export const deleteWeightLog: MutationResolvers["deleteWeightLog"] = async (
  parent,
  { input },
  context
) => {
  const log = await weightLogDataService.findOneOrFail(context, (q) =>
    q
      .where("id", "=", input.id)
      .andWhere("userId", "=", context.getCurrentUserId(true))
  );
  await weightLogDataService.deleteByIds(context, [log.id]);

  return {
    errors: [],
    logs: weightLogDataService.getConnection(context, {
      additionalRootResolvers: {
        day: log.day,
      },
      applyCustomConstraint: (q) =>
        q
          .where("userId", "=", context.getCurrentUserId(true))
          .andWhere("day", "=", log.day),
    }),
  };
};
