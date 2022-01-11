import { ulid } from "ulid";

import { Context } from "../../createContext";
import { SaveFoodLogInput } from "../../graphql-types";
import { query } from "./query";
import { assertIsTruthy } from "../../../shared";
import { dbService } from "../../../api/config";
import { foodLogFoodDataService } from "../foodLogFood";
import { foodLogFoodMeasurementDataService } from "../foodLogFoodMeasurement";

export async function upsert(
  context: Context,
  input: SaveFoodLogInput
): Promise<void> {
  const { day, foodLogs } = input;
  const userId = context.getCurrentUserId();

  const db = await context.services.get(dbService);
  await db.transact();
  try {
    await Promise.all(
      foodLogs.map(async (foodLog) => {
        await query(context, async (q) => {
          const {
            id,
            description,
            calories,
            fat,
            carbs,
            protein,
            foodId,
            measurementId,
          } = foodLog;
          if (id) {
            q.update({
              description,
              calories,
              fat,
              carbs,
              protein,
            })
              .where("id", "=", id)
              .andWhere("userId", "=", userId)
              .limit(1);
          } else {
            q.insert({
              id: ulid(),
              day,
              description,
              calories,
              fat,
              carbs,
              protein,
              userId,
            });
            if (foodId) {
              await foodLogFoodDataService.create(context, {
                day,
                foodId,
                userId,
              });
            }
            if (measurementId) {
              await foodLogFoodMeasurementDataService.create(context, {
                day,
                measurementId,
                userId,
              });
            }
          }
          return q;
        });
      })
    );
    await db.commit();
  } catch (error) {
    await db.rollback(error);
    throw error;
  }
}
