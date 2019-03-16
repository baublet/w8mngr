import { query } from "../config/db";

export default async function countFoodEntriesByUseId(
  userId: number
): Promise<number> {
  const queryResult = await query({
    text: "SELECT COUNT(id) AS cnt FROM food_entries WHERE user_id = $1",
    values: [userId]
  });
  return parseInt(queryResult.result.rows[0].cnt, 10);
}
