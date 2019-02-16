import { FoodType } from "./types";
import { query } from "../config/db";

export default function readFood(
  userId: number,
  id: number
): Promise<FoodType | false> {
  return new Promise(async resolve => {
    const queryResult = await query({
      text: `SELECT * FROM foods WHERE user_id = $1 AND id = $2`,
      values: [userId, id]
    });

    if (queryResult.result.rows && queryResult.result.rows.length) {
      resolve(queryResult.result.rows[0]);
    } else {
      resolve(false);
    }
  });
}
