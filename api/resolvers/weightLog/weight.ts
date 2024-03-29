import { WeightLogResolvers } from "../../generated";
import { numberToNumericUnit } from "../../helpers";

export const weightLogWeight: WeightLogResolvers["weight"] = async (
  parent,
  args,
  context
) => {
  return numberToNumericUnit({
    context,
    work: parent.weight,
    incomingUnit: "grams",
    outgoingUnit: args.unit || "lbs",
  });
};
