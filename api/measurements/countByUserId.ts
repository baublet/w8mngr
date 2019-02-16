export default function countMeasurementsByUseId(
  userId: Number
): Promise<Number> {
  return new Promise(async (resolve, reject) => {
    const { query } = require("../config/db"),
      queryResult = await query({
        text: "SELECT COUNT(id) AS cnt FROM measurements WHERE user_id = $1",
        values: [userId]
      });
    resolve(parseInt(queryResult.result.rows[0].cnt, 10));
  });
}
