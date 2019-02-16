import { DBResultType } from "../config/db";
import { query } from "../config/db";
import { MeasurementType } from "./types";

export default function createMeasurement(
  foodId: number,
  amount: number,
  unit: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): Promise<MeasurementType> {
  return new Promise(async resolve => {
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
    resolve(queryResult.result ? queryResult.result.rows[0] : []);
  });
}
