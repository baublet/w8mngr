import { assertIsError } from "../../../shared";
import { dbService } from "../../config";
import { Context } from "../../createContext";
import { WeightLogInput } from "../../graphql-types";
import { rawInputToUnit } from "../../helpers";
import { rootService } from "./rootService";

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
  const db = await context.services.get(dbService);
  await db.transact();

  try {
    await rootService.upsert(
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
    return {
      errors: [],
      logs: rootService.getConnection(context, {
        additionalRootResolvers: {
          day,
        },
        applyCustomConstraint: (q) =>
          q.where("userId", "=", userId).andWhere("day", "=", day),
      }),
    };
  } catch (error) {
    assertIsError(error);
    await db.rollback(error);
    return {
      errors: [error.message],
    };
  }
}
