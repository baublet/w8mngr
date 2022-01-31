import { MutationResolvers } from "../../graphql-types";
import { weightLogDataService } from "../../dataServices";

export const saveWeightLog: MutationResolvers["saveWeightLog"] = async (
  parent,
  { input },
  context
) => {
  return weightLogDataService.saveMutation(context, {
    input: input.weightLogs,
    userId: context.getCurrentUserId(),
    day: input.day,
  });
};
