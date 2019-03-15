import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default function deleteActivityEntry(
  id: number,
  user_id: number
): Promise<boolean> {
  return new Promise(async resolve => {
    const queryResult = <DBResultType>await query({
      text: "DELETE FROM activity_entries WHERE id = $1 AND user_id = $2",
      values: [<number>id, <number>user_id]
    });
    if (queryResult.result && queryResult.result.rowCount > 0) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
