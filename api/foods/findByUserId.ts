import { FoodType } from "./types";
import { query } from "../config/db";

export default function findUserByUserIdAndDays(
  userId: number
): Promise<Array<FoodType> | false> {
  return new Promise(async resolve => {
    const queryResult = await query({
      text: "SELECT * FROM foods WHERE user_id = $1::int",
      values: [userId]
    });

    if (queryResult.result.rows && queryResult.result.rows.length) {
      resolve(queryResult.result.rows);
    } else {
      resolve(false);
    }
  });
}
