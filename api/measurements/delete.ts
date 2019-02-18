import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default function deleteMeasurement(
  id: number,
  foodId: number,
  userId: number
): Promise<boolean> {
  return new Promise(async resolve => {
    // First, select the foodId to be sure it's
    // owned by the user
    const initialQueryResult = <DBResultType>await query({
      text: `
      SELECT * from foods WHERE id = $1 AND user_id = $2
      `,
      values: [<number>foodId, <number>userId]
    });

    if (!initialQueryResult.result || !initialQueryResult.result.rowCount) {
      return resolve(false);
    }

    const queryResult = <DBResultType>await query({
      text: `
      DELETE FROM measurements WHERE id = $1 AND food_id = $2
      `,
      values: [<number>id, <number>foodId]
    });
    if (queryResult.result && queryResult.result.rowCount > 0) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
