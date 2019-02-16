import { FoodType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default function updateFood(
  id: number,
  userId: number,
  name: string,
  description: string
): Promise<FoodType> {
  return new Promise(async resolve => {
    const queryResult = <DBResultType>await query({
      text:
        "UPDATE foods SET (name, description) = ($3, $4) WHERE id = $1 AND user_id = $2 RETURNING *",
      values: [<number>id, <number>userId, <string>name, <string>description]
    });
    resolve(queryResult.result.rows[0]);
  });
}
