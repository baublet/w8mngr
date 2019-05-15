import { FoodType } from "./types";
import { query } from "api/config/db";

export default async function createFood(
  userId: number,
  name: string,
  description: string = ""
): Promise<FoodType> {
  const queryResult = await query({
    text:
      "INSERT INTO foods (user_id, name, description, created_at, updated_at) VALUES ($1, $2, $3, now(), now()) RETURNING *",
    values: [<number>userId, <string>name, <string>description]
  });
  return queryResult.rows[0];
}
