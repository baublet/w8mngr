import { ActivityType } from "./types";
import { query } from "api/config/db";

export default async function updateActivity(
  id: number,
  userId: number,
  name: string,
  description: string,
  exrx: string = "",
  activity_type: number = 0,
  muscle_groups: string = "00000000000000",
  intensity: number = 0
): Promise<ActivityType> {
  const queryResult = await query({
    text: `
        UPDATE activities SET
          name = $3,
          description = $4,
          exrx = $5,
          activity_type = $6,
          muscle_groups = $7,
          intensity = $8,
          updated_at = now()
        WHERE id = $1
          AND user_id = $2
        RETURNING *
      `,
    values: [
      <number>id,
      <number>userId,
      <string>name,
      <string>description,
      <string>exrx,
      <number>activity_type,
      <string>muscle_groups,
      <number>intensity
    ]
  });
  return queryResult.rows[0];
}
