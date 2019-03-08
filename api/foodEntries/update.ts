import { FoodEntryType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default function updateFoodEntry(
  id: number,
  userId: number,
  description: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): Promise<FoodEntryType> {
  return new Promise(async resolve => {
    const queryResult = <DBResultType>await query({
      text:
        "UPDATE food_entries SET (description, calories, fat, carbs, protein) = ($3, $4, $5, $6, $7) WHERE id = $1 AND user_id = $2 RETURNING *",
      values: [
        <number>id,
        <number>userId,
        <string>description,
        <number>calories,
        <number>fat,
        <number>carbs,
        <number>protein
      ]
    });
    resolve(queryResult.result.rows[0]);
  });
}
