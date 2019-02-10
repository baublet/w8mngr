import { FoodEntryType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default function updateFoodEntry(
  id: Number,
  userId: Number,
  description: String,
  calories: Number,
  fat: Number,
  carbs: Number,
  protein: Number
): Promise<FoodEntryType> {
  return new Promise(async resolve => {
    const queryResult = <DBResultType>await query({
      text:
        "UPDATE food_entries SET (description, calories, fat, carbs, protein) = ($3, $4, $5, $6, $7) WHERE id = $1 AND user_id = $2 RETURNING *",
      values: [
        <Number>id,
        <Number>userId,
        <String>description,
        <Number>calories,
        <Number>fat,
        <Number>carbs,
        <Number>protein
      ]
    });
    resolve(queryResult.result.rows[0]);
  });
}
