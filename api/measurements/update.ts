import { MeasurementType } from "./types";
import { DBResultType } from "api/config/db";
import { query } from "api/config/db";

export default async function updateMeasurement(
  id: number,
  foodId: number,
  userId: number,
  amount: number,
  unit: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): Promise<MeasurementType> {
  const queryResult = <DBResultType>await query({
    text: `
      UPDATE measurements
        SET amount = $4,
          unit = $5,
          calories = $6,
          fat = $7,
          carbs = $8,
          protein = $9
      WHERE food_id = (
        SELECT id FROM foods WHERE id = $2 AND user_id = $3
      )
      AND id = $1
      RETURNING *
        `,
    values: [
      <number>id,
      <number>foodId,
      <number>userId,
      <number>amount,
      <string>unit,
      <number>calories,
      <number>fat,
      <number>carbs,
      <number>protein
    ]
  });
  return queryResult.result.rows[0];
}
