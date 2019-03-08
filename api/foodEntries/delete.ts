import { FoodEntryType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default function deleteFoodEntry(
  id: number,
  userId: number
): Promise<boolean> {
  return new Promise(async resolve => {
    const queryResult = <DBResultType>await query({
      text: "DELETE FROM food_entries WHERE id = $1 AND user_id = $2",
      values: [<number>id, <number>userId]
    });
    if (queryResult.result && queryResult.result.rowCount > 0) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
