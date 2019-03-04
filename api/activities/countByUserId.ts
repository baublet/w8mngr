export default function countActivitiesByUserId(
  userId: number
): Promise<number> {
  return new Promise(async (resolve, reject) => {
    const { query } = require("../config/db"),
      queryResult = await query({
        text: `
          SELECT
            COUNT(id) AS cnt
          FROM activities
          WHERE user_id = $1
            AND deleted = false
        `,
        values: [userId]
      });
    resolve(parseInt(queryResult.result.rows[0].cnt, 10));
  });
}