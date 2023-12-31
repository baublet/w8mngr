import { weightLogDataService } from "../../dataServices/weightLog/index.js";
import { MutationResolvers } from "../../generated.js";

export const saveWeightLog: MutationResolvers["saveWeightLog"] = async (
  parent,
  { input },
  context
) => {
  return weightLogDataService.saveMutation(context, {
    input: input.weightLogs,
    userId: context.getCurrentUserId(true),
    day: input.day,
  });
};
