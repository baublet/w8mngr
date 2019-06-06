import splitNumeric from "shared/helpers/splitNumeric";
import toMmFrom from "./toMmFrom";

// Returns mm from an arbitrary string.
export default function distanceToMm(
  original: string,
  unitString: string = "mi"
): Promise<number> {
  return new Promise((resolve, reject) => {
    const parts = splitNumeric(original),
      numeric: number = parts[0] as number,
      unit: string = (parts[1] || unitString) as string;

    const converted = toMmFrom(numeric, unit);

    resolve(Math.round(converted));
  });
}
