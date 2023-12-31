import { Context } from "../../createContext.js";
import { FoodInput } from "../../generated.js";
import { foodMeasurementDataService } from "../foodMeasurement/index.js";
import { rootService } from "./rootService.js";

export async function saveMutation(
  context: Context,
  { input, userId }: { input: FoodInput; userId: string }
) {
  try {
    const { measurements, ...foodProperties } = input;

    const upsertResults = await rootService.upsertBy(
      context,
      [{ ...foodProperties, id: foodProperties.id, userId }],
      ["userId"]
    );
    const result = upsertResults[0];

    if (!result) {
      throw new Error(
        `Unknown error upserting food. Expected an upsert result. Instead received ${JSON.stringify(
          upsertResults
        )}`
      );
    }

    if (measurements) {
      await foodMeasurementDataService.upsert(
        context,
        measurements.map((measurement) => ({
          ...measurement,
          userId,
          foodId: result.id,
        }))
      );
    }

    return {
      food: rootService.findOneOrFailBy(context, (q) =>
        q.where("id", "=", result.id).where("userId", "=", userId)
      ),
    };
  } catch (error) {
    return {
      food: undefined,
      errors: [error],
    };
  }
}
