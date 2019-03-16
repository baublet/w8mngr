import { query } from "../config/db";

export default async function countFoodsByUseId(
  userId: number
): Promise<number> {
  const queryResult = await query({
    text: "SELECT COUNT(id) AS cnt FROM foods WHERE user_id = $1",
    values: [userId]
  });
  return parseInt(queryResult.result.rows[0].cnt, 10);
}
