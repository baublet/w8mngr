import { Context } from "../../createContext";
import { FoodInput } from "../../generated";
import { foodMeasurementDataService } from "../foodMeasurement";
import { rootService } from "./rootService";

export async function saveMutation(
  context: Context,
  { input, userId }: { input: FoodInput; userId: string }
) {
  try {
    const { measurements, ...foodProperties } = input;

    const upsertResults = await rootService.upsert(
      context,
      [{ ...foodProperties, id: foodProperties.id, userId }],
      (q) => q.where("userId", "=", userId)
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
          foodId,
        }))
      );
    }

    return {
      food: rootService.findOneOrFail(context, (q) =>
        q.where("id", "=", foodId).andWhere("userId", "=", userId)
      ),
    };
  } catch (error) {
    return {
      food: undefined,
      errors: [error],
    };
  }
}
