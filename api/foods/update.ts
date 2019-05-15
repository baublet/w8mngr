import { FoodType } from "./types";
import { query } from "api/config/db";

export default async function updateFood(
  id: number,
  userId: number,
  name: string,
  description: string
): Promise<FoodType> {
  const queryResult = await query({
    text:
      "UPDATE foods SET (name, description) = ($3, $4) WHERE id = $1 AND user_id = $2 RETURNING *",
    values: [<number>id, <number>userId, <string>name, <string>description]
  });
  return queryResult.rows[0];
}
