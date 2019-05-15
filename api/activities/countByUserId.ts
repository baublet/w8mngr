import { query } from "api/config/db";

export default async function countActivitiesByUserId(
  userId: number
): Promise<number> {
  const queryResult = await query({
    text: `
          SELECT
            COUNT(id) AS cnt
          FROM activities
          WHERE user_id = $1
            AND deleted = false
        `,
    values: [userId]
  });
  return parseInt(queryResult.rows[0].cnt, 10);
}
