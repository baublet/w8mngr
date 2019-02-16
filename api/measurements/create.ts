import { DBResultType } from "../config/db";
import { query } from "../config/db";
import { MeasurementType } from "./types";

export default function createMeasurement(
  foodId: number,
  userId: number,
  amount: number,
  unit: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): Promise<MeasurementType | false> {
  return new Promise(async resolve => {
    const validationResult = <DBResultType>await query({
      text: `SELECT * FROM foods WHERE id = $1 AND user_id = $2`,
      values: [<number>foodId, <number>userId]
    });

    if (!validationResult.result.rows || !validationResult.result.rows.length) {
      return resolve(false);
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

    resolve(queryResult.result ? queryResult.result.rows[0] : false);
  });
}
