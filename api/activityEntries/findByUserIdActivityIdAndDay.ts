import { query } from "api/config/db";
import { ActivityEntryType } from "./types";

export default async function findActivityEntriesByUserIdAndActivityIdAndDay(
  user_id: number,
  activity_id: number,
  day: number
): Promise<Array<ActivityEntryType>> {
  const queryResult = await query({
    text: `
          SELECT
            *
          FROM activity_entries
          WHERE
            user_id = $1
            AND activity_id = $2
            AND day = $3
        `,
    values: [<number>user_id, <number>activity_id, <number>day]
  });
  return queryResult.result.rows;
}
