import { query } from "../config/db";

export default async function countMeasurementsByFoodId(
  foodId: number
): Promise<number> {
  const queryResult = await query({
    text: "SELECT COUNT(id) AS cnt FROM measurements WHERE food_id = $1",
    values: [foodId]
  });
  return queryResult.result ? parseInt(queryResult.result.rows[0].cnt, 10) : 0;
}
