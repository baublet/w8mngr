import { ActivityType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default async function findActivitiesByUserId(
  id: number,
  offset: number = 0,
  limit: number = 10
): Promise<Array<ActivityType>> {
  const queryResult = <DBResultType>await query({
    text: `
      SELECT *
        FROM activities
      WHERE deleted = false
        AND
          (
            user_id = $1::int
            OR user_id = 1
          )
      OFFSET  $2::int
      LIMIT   $3::int
      `,
    values: [<number>id, <number>offset, <number>limit]
  });
  return queryResult.result.rows;
}
