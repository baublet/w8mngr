import splitNumeric from "shared/helpers/splitNumeric";
import toMmFrom from "./toMmFrom";

// Returns mm from an arbitrary string.
export default function distanceToMm(
  original: string,
  unitString: string = "mi"
): Promise<number> {
  return new Promise((resolve, reject) => {
    const parts = splitNumeric(original),
      numeric = parts[0],
      unit = parts[1] || unitString;

    const converted = toMmFrom(numeric, unit);

    resolve(Math.round(converted));
  });
}
