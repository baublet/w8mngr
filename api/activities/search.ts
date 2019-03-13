import { ActivityType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default async function searchActivities(
  userId: number,
  term: string = "%",
  muscleGroups: string = "%",
  orderBy: string = "updated_at",
  sort: "DESC" | "ASC" = "DESC",
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
        AND muscle_groups LIKE $2::text
        AND name ILIKE $3::text
      ORDER BY $4 ${sort}, id DESC
      OFFSET $5::int
      LIMIT $6::int
    `,
    values: [
      <number>userId,
      <string>muscleGroups,
      <string>term,
      <string>orderBy,
      <number>offset,
      <number>limit
    ]
  });
  return queryResult.result.rows;
}
