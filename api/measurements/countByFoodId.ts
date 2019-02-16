export default function countMeasurementsByFoodId(
  foodId: Number
): Promise<Number> {
  return new Promise(async (resolve, reject) => {
    const { query } = require("../config/db"),
      queryResult = await query({
        text: "SELECT COUNT(id) AS cnt FROM measurements WHERE food_id = $1",
        values: [foodId]
      });
    resolve(
      queryResult.result ? parseInt(queryResult.result.rows[0].cnt, 10) : 0
    );
  });
}
