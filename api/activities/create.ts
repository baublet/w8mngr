import { ActivityType } from "./types";
import { DBResultType } from "api/config/db";
import { query } from "api/config/db";

export default async function createActivity(
  userId: number,
  name: string,
  description: string,
  exrx: string = "",
  activity_type: number = 0,
  muscle_groups: string = "00000000000000",
  intensity: number = 0
): Promise<ActivityType> {
  const queryResult = <DBResultType>await query({
    text: `
        INSERT INTO
          activities
            (
              user_id, 
              name,
              description,
              exrx,
              activity_type,
              muscle_groups,
              intensity,
              created_at,
              updated_at
            )
          VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now())
        RETURNING *
      `,
    values: [
      <number>userId,
      <string>name,
      <string>description,
      <string>exrx,
      <number>activity_type,
      <string>muscle_groups,
      <number>intensity
    ]
  });
  return queryResult.result.rows[0];
}
