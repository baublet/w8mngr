export default function countFoodEntriesByUseId(
  userId: Number
): Promise<Number> {
  return new Promise(async (resolve, reject) => {
    const { query } = require("../config/db"),
      queryResult = await query({
        text: "SELECT COUNT(id) AS cnt FROM food_entries WHERE user_id = $1",
        values: [userId]
      });
    resolve(parseInt(queryResult.result.rows[0].cnt, 10));
  });
}
