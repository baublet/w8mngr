import Qty from "js-quantities";

import { WeightLogResolvers } from "../../generated";
import { numberToContextualNumericUnit } from "../../helpers";

export const weightLogWeight: WeightLogResolvers["weight"] = async (
  parent,
  args,
  context
) => {
  return numberToContextualNumericUnit({
    context,
    work: parent.weight,
    incomingUnit: "grams",
    outgoingUnit: args.unit || "lbs",
  });
};
