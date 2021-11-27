import { Context } from "../../createContext";
import { foodDataService } from "./index";
import {foodMeasurementDataService} from "../foodMeasurement"
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

    const newFood = await foodDataService.upsert(
      context,
      [foodProperties],
      (q) => q.where("userId", "=", userId)
    );

    if(measurements) {
      await foodMeasurementDataService.upsert(context, measurements)
    }

    await db.commit();
    return {
      food: foodDataService.findOneOrFail(context, (q) =>
        q.where("id", "=", newFood[0].id).andWhere("userId", "=", userId)
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
