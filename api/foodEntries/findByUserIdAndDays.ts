import { FoodEntryType } from "./types";
import { query } from "api/config/db";

export default async function findUserByUserIdAndDays(
  userId: number,
  days: Array<number>
): Promise<Array<FoodEntryType> | false> {
  const queryResult = await query({
    text:
      "SELECT * FROM food_entries WHERE user_id = $1::int AND day = ANY ($2::int[])",
    values: [userId, days]
  });

  if (queryResult.result.rows && queryResult.result.rows.length) {
    return queryResult.result.rows;
  } else {
    return false;
  }
}
