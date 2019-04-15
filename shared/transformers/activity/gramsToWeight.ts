import * as Unit from "mathjs";

// Resolves grams into display weight
export default async function gramsToWeight(
  grams: number,
  unitString: string = "lb"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const gramsUnit = Unit.unit(grams, "grams"),
      numeric = Unit.round(gramsUnit.toNumber(unitString), 1);
    resolve(numeric + " " + unitString);
  });
}
