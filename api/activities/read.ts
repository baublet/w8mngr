import { ActivityType } from "./types";
import { query } from "api/config/db";

export default async function readActivity(
  id: number,
  userId: number
): Promise<ActivityType> {
  const queryResult = await query({
    text: `
      SELECT *
        FROM activities
      WHERE id = $1
        AND user_id = $2
        AND deleted = false
      `,
    values: [<number>id, <number>userId]
  });
  return queryResult.rows[0];
}
