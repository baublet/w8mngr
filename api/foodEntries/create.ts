import { FoodEntryType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default function createFoodEntry(
  userId: Number,
  day: Number,
  description: String = "",
  calories: Number = 0,
  fat: Number = 0,
  carbs: Number = 0,
  protein: Number = 0
): Promise<FoodEntryType> {
  return new Promise(async resolve => {
    const queryResult = <DBResultType>await query({
      text:
        "INSERT INTO food_entries (user_id, day, description, calories, fat, carbs, protein, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now()) RETURNING *",
      values: [
        <Number>userId,
        <Number>day,
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
