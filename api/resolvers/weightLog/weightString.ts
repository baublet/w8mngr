import { WeightLogResolvers } from "../../generated";
import { numberToContextualUnit } from "../../helpers";

export const weightLogWeightString: WeightLogResolvers["weightString"] = async (
  parent,
  args,
  context
) => {
  return numberToContextualUnit(context, {
    activityType: "WEIGHT",
    work: parent.weight,
    requestedWorkUnit: args.unit,
  });
};
