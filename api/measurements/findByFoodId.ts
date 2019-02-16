import { MeasurementType } from "./types";
import { query } from "../config/db";

export default function findMeasurementByFoodId(
  userId: number,
  foodId: Array<number>
): Promise<Array<MeasurementType> | false> {
  return new Promise(async resolve => {
    const queryResult = await query({
      text: `SELECT * FROM measurements INNER JOIN foods ON foods.user_id = $1 AND foods.id = ANY ($2::int[]) AND measurements.food_id = ANY ($2::int[])`,
      values: [userId, foodId]
    });

    if (queryResult.result.rows && queryResult.result.rows.length) {
      resolve(queryResult.result.rows);
    } else {
      resolve(false);
    }
  });
}
