import { Context } from "../../createContext.js";
import { WeightLogInput } from "../../generated.js";
import { rawInputToUnit } from "../../helpers/rawInputToUnit.js";
import { rootService } from "./rootService.js";

export async function saveMutation(
  context: Context,
  {
    input,
    userId,
    day,
  }: {
    input: WeightLogInput[];
    userId: string;
    day: string;
  }
) {
  const results = await rootService.upsert(
    context,
    input.map((input) => ({
      id: String(input.id),
      weight: rawInputToUnit({
        work: input.weight,
        unit: "grams",
        defaultUnit: "pounds",
      }),
      userId,
      day,
    }))
  );

  const errorResults = getErrors(results);
  const logResults = getNonErrors(results);

  return {
    errors: errorResults.map((result) => result.error),
    logs: logResults.map((result) => result.entity),
  };
}

function getErrors<T extends {}>(
  results: (T | { error: string })[]
): { error: string }[] {
  return results.filter((result) => "error" in result) as any;
}

function getNonErrors<T extends {}>(results: (T | { error: string })[]): T[] {
  return results.filter((result) => !("error" in result)) as any;
}
