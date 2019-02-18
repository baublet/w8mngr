import { MeasurementType } from "./types";
import { query } from "../config/db";

export default function findMeasurementByFoodId(
  userId: number,
  foodId: Array<number>
): Promise<Array<MeasurementType> | false> {
  return new Promise(async resolve => {
    const queryResult = await query({
      text: `SELECT * FROM measurements WHERE food_id = ANY (SELECT id FROM foods WHERE user_id = $1 AND id = ANY($2::int[])) ORDER BY popularity, unit`,
      values: [userId, foodId]
    });

    if (queryResult.result.rows && queryResult.result.rows.length) {
      resolve(queryResult.result.rows);
    } else {
      resolve(false);
    }
  });
}
