import { FoodType } from "./types";
import { query } from "../config/db";

export default function findUserByUserIdAndDays(
  userId: number,
  offset: number = 0,
  limit: number = 10
): Promise<Array<FoodType> | false> {
  return new Promise(async resolve => {
    const queryResult = await query({
      text: `
        SELECT *
          FROM foods
        WHERE user_id = $1::int
        ORDER BY updated_at DESC
        OFFSET $2::int
        LIMIT $3::int
      `,
      values: [<number>userId, <number>offset, <number>limit]
    });

    if (queryResult.result.rows && queryResult.result.rows.length) {
      resolve(queryResult.result.rows);
    } else {
      resolve(false);
    }
  });
}
