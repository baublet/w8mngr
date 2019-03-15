import { query } from "../config/db";
import { ActivityEntryType } from "./types";

export default function findActivityEntriesByUserIdAndActivityId(
  user_id: number,
  activity_id: number
): Promise<Array<ActivityEntryType>> {
  return new Promise(async resolve => {
    const queryResult = await query({
      text: `
          SELECT
            *
          FROM activity_entries
          WHERE
            user_id = $1
            AND activity_id = $2
        `,
      values: [<number>user_id, <number>activity_id]
    });
    resolve(queryResult.result.rows);
  });
}
