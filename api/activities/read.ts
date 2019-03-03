import { ActivityType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default async function readActivity(
  id: number,
  userId: number
): Promise<ActivityType> {
  const queryResult = <DBResultType>await query({
    text: `
      SELECT *
        FROM activities
      WHERE id = $1
        AND user_id = $2
      `,
    values: [<number>id, <number>userId]
  });
  return queryResult.result.rows[0];
}
