import { weightLogDataService } from "../../dataServices/weightLog/index.js";
import { UserResolvers } from "../../generated.js";

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
