import { dedupe, filterOutErrors, weightedClamp } from "../../../shared";
import { weightLogDataService } from "../../dataServices";
import { UserResolvers } from "../../generated";
import { getDateRangeWithDefault, globalInMemoryCache } from "../../helpers";

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
