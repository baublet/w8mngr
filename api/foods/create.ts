import { FoodType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default function createFood(
  userId: number,
  name: string,
  description: string = ""
): Promise<FoodType> {
  return new Promise(async resolve => {
    const queryResult = <DBResultType>await query({
      text:
        "INSERT INTO foods (user_id, name, description, created_at, updated_at) VALUES ($1, $2, $3, now(), now()) RETURNING *",
      values: [<number>userId, <string>name, <string>description]
    });
    resolve(queryResult.result.rows[0]);
  });
}
