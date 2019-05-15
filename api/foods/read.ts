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

  if (queryResult.rows && queryResult.rows.length) {
    return queryResult.rows[0];
  } else {
    return false;
  }
}
