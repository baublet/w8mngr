import splitNumeric from "shared/helpers/splitNumeric";
import toGramsFrom from "./toGramsFrom";

// Returns grams from an arbitrary string.
export default function weightToGrams(
  weight: string,
  unitString: string = "lb"
): Promise<number> {
  return new Promise((resolve, reject) => {
    const parts = splitNumeric(weight),
      numeric = parts[0],
      unit = parts[1] || unitString;
    resolve(Math.round(toGramsFrom(numeric, unit)));
  });
}
