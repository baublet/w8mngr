import { FoodEntryType } from "./types";
import { DBResultType } from "api/config/db";
import { query } from "api/config/db";

export default async function createFoodEntry(
  userId: number,
  day: number,
  description: string = "",
  calories: number = 0,
  fat: number = 0,
  carbs: number = 0,
  protein: number = 0
): Promise<FoodEntryType> {
  const queryResult = <DBResultType>await query({
    text:
      "INSERT INTO food_entries (user_id, day, description, calories, fat, carbs, protein, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now()) RETURNING *",
    values: [
      <number>userId,
      <number>day,
      <string>description,
      <number>calories,
      <number>fat,
      <number>carbs,
      <number>protein
    ]
  });
  return queryResult.result.rows[0];
}
