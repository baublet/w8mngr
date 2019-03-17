import { DBResultType } from "api/config/db";
import { query } from "api/config/db";

export default async function deleteFoodEntry(
  id: number,
  userId: number
): Promise<boolean> {
  const queryResult = <DBResultType>await query({
    text: "DELETE FROM food_entries WHERE id = $1 AND user_id = $2",
    values: [<number>id, <number>userId]
  });
  if (queryResult.result && queryResult.result.rowCount > 0) {
    return true;
  } else {
    return false;
  }
}
