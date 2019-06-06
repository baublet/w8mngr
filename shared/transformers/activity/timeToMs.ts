import splitNumeric from "shared/helpers/splitNumeric";
import toMsFrom from "./toMsFrom";

// Returns grams from an arbitrary string.
export default function timeToMs(
  original: string,
  unitString: string = "ms"
): Promise<number> {
  return new Promise((resolve, reject) => {
    const parts = splitNumeric(original),
      numeric: number = parts[0] as number,
      unit: string = (parts[1] || unitString) as string;

    const converted = toMsFrom(numeric, unit);

    resolve(Math.round(converted));
  });
}
