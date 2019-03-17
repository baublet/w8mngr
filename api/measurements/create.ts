import { DBResultType } from "api/config/db";
import { query } from "api/config/db";
import { MeasurementType } from "./types";

export default async function createMeasurement(
  foodId: number,
  userId: number,
  amount: number,
  unit: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): Promise<MeasurementType | false> {
  const validationResult = <DBResultType>await query({
    text: `SELECT * FROM foods WHERE id = $1 AND user_id = $2`,
    values: [<number>foodId, <number>userId]
  });

  if (!validationResult.result.rows || !validationResult.result.rows.length) {
    return false;
  }

  const queryResult = <DBResultType>await query({
    text: `INSERT INTO measurements (food_id, amount, unit, calories, fat, carbs, protein, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now()) RETURNING *`,
    values: [
      <number>foodId,
      <number>amount,
      <string>unit,
      <number>calories,
      <number>fat,
      <number>carbs,
      <number>protein
    ]
  });

  return queryResult.result ? queryResult.result.rows[0] : false;
}
