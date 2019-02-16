import { MeasurementType } from "./types";
import { query } from "../config/db";

export default function findMeasurementByFoodId(
  foodId: number
): Promise<Array<MeasurementType> | false> {
  return new Promise(async resolve => {
    const queryResult = await query({
      text: "SELECT * FROM measurements WHERE food_id = $1::int",
      values: [foodId]
    });

    if (queryResult.result.rows && queryResult.result.rows.length) {
      resolve(queryResult.result.rows);
    } else {
      resolve(false);
    }
  });
}
