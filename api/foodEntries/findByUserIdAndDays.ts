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

  if (queryResult.rows && queryResult.rows.length) {
    return queryResult.rows;
  } else {
    return false;
  }
}
