import { WeightLogResolvers } from "../../generated.js";
import { numberToContextualUnit } from "../../helpers/numberToContextualUnit.js";

export const weightLogWeightString: WeightLogResolvers["weightString"] = async (
  parent,
  args,
  context,
) => {
  return numberToContextualUnit(context, {
    activityType: "WEIGHT",
    work: parent.weight,
    requestedWorkUnit: args.unit,
  });
};
