import splitNumeric from "shared/helpers/splitNumeric";
import toMsFrom from "./toMsFrom";

// Returns grams from an arbitrary string.
export default function timeToMs(
  original: string,
  unitString: string = "ms"
): Promise<number> {
  return new Promise((resolve, reject) => {
    let totalMs: number = 0;
    const parts = splitNumeric(original);

    for (let i = 0; i < parts.length; i = i + 2) {
      const unit: string =
        parts.length > i + 1 ? (parts[i + 1] as string) : unitString;
      totalMs += toMsFrom(parts[i] as number, unit);
    }

    resolve(Math.round(totalMs));
  });
}
