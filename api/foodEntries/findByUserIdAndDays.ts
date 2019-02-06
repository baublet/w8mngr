import { FoodEntryType } from "./types";
import { query } from "../config/db";

export default function findUserByUserIdAndDays(
  userId: Number,
  days: Array<Number>
): Promise<Array<FoodEntryType> | false> {
  return new Promise(async resolve => {
    const queryResult = await query({
      text:
        "SELECT * FROM food_entries WHERE user_id = $1::int AND day = ANY ($2::int[])",
      values: [userId, days]
    });

    if (queryResult.result.rows && queryResult.result.rows.length) {
      resolve(queryResult.result.rows);
    } else {
      resolve(false);
    }
  });
}
