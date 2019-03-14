import { unit as convert, Unit } from "mathjs";

// Returns grams from an arbitrary string.
export default async function weightToGrams(
  weight: string,
  unit: string = "lb"
): Promise<number> {
  return new Promise((resolve, reject) => {
    let convertedUnit: null | Unit = null;
    if (isNaN(Number(weight))) {
      convertedUnit = convert(weight);
    } else {
      convertedUnit = convert(parseInt(weight, 10), unit);
    }
    resolve(Math.round(convertedUnit.toNumber("gram")));
  });
}
