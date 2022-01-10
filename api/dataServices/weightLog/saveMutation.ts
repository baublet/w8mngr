import { Context } from "../../createContext";
import { weightLogDataService } from "./index";
import { WeightLogInput } from "../../graphql-types";
import { dbService } from "../../config";
import { WeightLog } from "./types";
import { assertIsError } from "../../../shared";
import { doTimes, rawInputToUnit } from "../../helpers";

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
): Promise<Error | undefined> {
  const db = await context.services.get(dbService);
  await db.transact();

  try {
    await weightLogDataService.upsert(
      context,
      input.map((input) => ({
        id: input.id,
        weight: rawInputToUnit({
          work: input.weight,
          unit: "grams",
          defaultUnit: "pounds",
        }),
        userId,
        day,
      })),
      (q) => q.where("userId", "=", userId)
    );
    await db.commit();
    return undefined;
  } catch (error) {
    assertIsError(error);
    await db.rollback(error);
    return error;
  }
}
