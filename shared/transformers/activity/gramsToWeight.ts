import { massUnits } from "shared/data/units";

// Resolves grams into display weight
export default async function gramsToWeight(
  grams: number,
  unitString: string = "lb"
): Promise<string> {
  return new Promise((resolve, reject) => {
    resolve(Math.round(grams / massUnits[unitString]) + " " + unitString);
  });
}
