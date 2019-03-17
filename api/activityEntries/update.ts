import { ActivityEntryType } from "./types";
import { DBResultType } from "api/config/db";
import { query } from "api/config/db";

export default async function updateActivityEntry(
  id: number,
  user_id: number,
  reps: number,
  work: number
): Promise<ActivityEntryType> {
  const queryResult = <DBResultType>await query({
    text: `
        UPDATE activity_entries
        SET reps = $3,
            work = $4,
            updated_at = now()
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `,
    values: [<number>id, <number>user_id, <number>reps, <number>work]
  });
  return queryResult.result.rows[0];
}
