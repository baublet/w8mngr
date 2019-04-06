import * as Unit from "mathjs";

// Returns grams from an arbitrary string.
export default async function weightToGrams(
  weight: string,
  unitString: string = "lb"
): Promise<number> {
  return new Promise((resolve, reject) => {
    let convertedUnit: null | Unit.Unit = null;
    if (isNaN(Number(weight))) {
      convertedUnit = Unit.unit(weight);
    } else {
      convertedUnit = Unit.unit(parseInt(weight, 10), unitString);
    }
    resolve(Math.round(convertedUnit.toNumber("gram")));
  });
}
