import { query } from "api/config/db";

export default async function countMeasurementsByFoodId(
  foodId: number
): Promise<number> {
  const queryResult = await query({
    text: "SELECT COUNT(id) AS cnt FROM measurements WHERE food_id = $1",
    values: [foodId]
  });
  return queryResult ? parseInt(queryResult.rows[0].cnt, 10) : 0;
}
