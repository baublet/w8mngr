import { massUnits } from "shared/data/units";

// Resolves grams into display weight
export default function gramsToWeight(
  grams: number,
  unitString: string = "lb"
): string {
  return Math.round(grams / massUnits[unitString]) + " " + unitString;
}
