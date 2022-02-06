import { weightLogDataService } from "../../dataServices";
import { MutationResolvers } from "../../graphql-types";

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
