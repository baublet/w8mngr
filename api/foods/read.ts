import { FoodType } from "./types";
import { query } from "api/config/db";

export default async function readFood(
  userId: number,
  id: number
): Promise<FoodType | false> {
  const queryResult = await query({
    text: `SELECT * FROM foods WHERE user_id = $1 AND id = $2`,
    values: [userId, id]
  });

  if (queryResult.result.rows && queryResult.result.rows.length) {
    return queryResult.result.rows[0];
  } else {
    return false;
  }
}
