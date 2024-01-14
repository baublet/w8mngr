import { weightLogDataService } from "../../dataServices/weightLog/index.js";
import { MutationResolvers } from "../../generated.js";

export const deleteWeightLog: MutationResolvers["deleteWeightLog"] = async (
  parent,
  { input },
  context,
) => {
  const log = await weightLogDataService.findOneOrFailBy(context, (q) =>
    q
      .where("id", "=", input.id)
      .where("userId", "=", context.getCurrentUserId(true)),
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
          .where("day", "=", log.day),
    }),
  };
};
