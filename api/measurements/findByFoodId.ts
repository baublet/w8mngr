import { MeasurementType } from "./types";
import { query } from "api/config/db";

export default async function findMeasurementByFoodId(
  userId: number,
  foodId: Array<number>
): Promise<Array<MeasurementType> | false> {
  const queryResult = await query({
    text: `SELECT * FROM measurements WHERE food_id = ANY (SELECT id FROM foods WHERE user_id = $1 AND id = ANY($2::int[])) ORDER BY popularity, unit`,
    values: [userId, foodId]
  });

  if (queryResult.result.rows && queryResult.result.rows.length) {
    return queryResult.result.rows;
  } else {
    return false;
  }
}
