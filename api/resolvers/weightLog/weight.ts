import { WeightLogResolvers } from "../../generated.js";
import { numberToNumericUnit } from "../../helpers/numberToNumericUnit.js";

export const weightLogWeight: WeightLogResolvers["weight"] = async (
  parent,
  args,
  context,
) => {
  return numberToNumericUnit({
    context,
    work: parent.weight,
    incomingUnit: "grams",
    outgoingUnit: args.unit || "lbs",
  });
};
