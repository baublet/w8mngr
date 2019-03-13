import { ActivityEntryType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default async function createActivityEntry(
  user_id: number,
  activity_id: number,
  day: number,
  reps: number,
  work: number,
  routine_id: number | null = null
): Promise<ActivityEntryType> {
  const queryResult = <DBResultType>await query({
    text: `
        INSERT INTO
          activity_entries
            (
              user_id,
              activity_id,
              day,
              reps,
              work,
              routine_id,
              created_at,
              updated_at
            )
          VALUES ($1, $2, $3, $4, $5, $6, now(), now())
        RETURNING *
      `,
    values: [
      <number>user_id,
      <number>activity_id,
      <number>day,
      <number>reps,
      <number>work,
      <number | null>routine_id
    ]
  });
  return queryResult.result.rows[0];
}
