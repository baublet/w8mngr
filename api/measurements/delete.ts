import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default function deleteFood(
  id: Number,
  userId: Number
): Promise<boolean> {
  return new Promise(async resolve => {
    const queryResult = <DBResultType>await query({
      text: "DELETE FROM measurements WHERE id = $1 AND user_id = $2",
      values: [<Number>id, <Number>userId]
    });
    if (queryResult.result && queryResult.result.rowCount > 0) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
