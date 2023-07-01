import { weightLogDataService } from "../../dataServices/weightLog";
import { UserResolvers } from "../../generated";

export const userWeightLogSummary: UserResolvers["weightLogSummary"] = async (
  parent,
  args,
  context
) => {
  return weightLogDataService.getVisualizationData(context, {
    userId: parent.id,
    input: args.input,
  });
};
