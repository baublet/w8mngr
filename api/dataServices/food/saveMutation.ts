import { Context } from "../../createContext";
import { foodDataService } from "./index";
import { foodMeasurementDataService } from "../foodMeasurement";
import { FoodInput } from "../../graphql-types";
import { dbService } from "../../config";

export async function saveMutation(
  context: Context,
  { input, userId }: { input: FoodInput; userId: string }
) {
  const db = await context.services.get(dbService);
  await db.transact();
  try {
    const { measurements, ...foodProperties } = input;

    const upsertResults = await foodDataService.upsert(
      context,
      [{ ...foodProperties, userId }],
      (q) => q.where("userId", "=", userId)
    );
    const foodId = upsertResults[0].id;

    if (!foodId) {
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

    await db.commit();
    return {
      food: foodDataService.findOneOrFail(context, (q) =>
        q.where("id", "=", foodId).andWhere("userId", "=", userId)
      ),
    };
  } catch (error) {
    await db.rollback(error);
    return {
      food: undefined,
      errors: [error],
    };
  }
}
