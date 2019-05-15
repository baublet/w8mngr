import { ActivityEntryType } from "./types";
import { query } from "api/config/db";

export default async function createActivityEntry(
  user_id: number,
  activity_id: number,
  day: number,
  reps: number,
  work: number,
  calories: number = 0,
  routine_id: number | null = null
): Promise<ActivityEntryType> {
  const queryResult = await query({
    text: `
        INSERT INTO
          activity_entries
            (
              user_id,
              activity_id,
              day,
              reps,
              work,
              calories,
              routine_id,
              created_at,
              updated_at
            )
          VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now())
        RETURNING *
      `,
    values: [
      <number>user_id,
      <number>activity_id,
      <number>day,
      <number>reps,
      <number>work,
      <number>calories,
      <number | null>routine_id
    ]
  });
  return queryResult.rows[0];
}
