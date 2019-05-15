import { ActivityType } from "./types";
import { query } from "api/config/db";

export default async function findActivitiesByUserId(
  userId: number,
  orderBy: string = "updated_at",
  sort: "DESC" | "ASC" = "DESC",
  offset: number = 0,
  limit: number = 10
): Promise<Array<ActivityType>> {
  const queryResult = await query({
    text: `
      SELECT *
        FROM activities
      WHERE deleted = false
        AND
          (
            user_id = $1::int
            OR user_id = 1
          )
      ORDER BY $2 ${sort}, id DESC
      OFFSET $3::int
      LIMIT $4::int
    `,
    values: [<number>userId, <string>orderBy, <number>offset, <number>limit]
  });
  return queryResult.rows;
}
