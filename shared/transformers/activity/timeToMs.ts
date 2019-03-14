import { unit as convert, Unit } from "mathjs";

// Returns grams from an arbitrary string.
export default async function timeToMs(
  original: string,
  unit: string = "ms"
): Promise<number> {
  return new Promise((resolve, reject) => {
    let convertedUnit: null | Unit = null;
    if (isNaN(Number(original))) {
      convertedUnit = convert(original);
    } else {
      convertedUnit = convert(parseInt(original, 10), unit);
    }
    resolve(Math.round(convertedUnit.toNumber("ms")));
  });
}
