import { MeasurementType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default function updateMeasurement(
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
  return new Promise(async resolve => {
    const queryResult = <DBResultType>await query({
      text: `
        UPDATE measurements
        SET amount = $4,
          unit = $5,
          calories = $6,
          fat = $7,
          carbs = $8,
          protein = $9
      FROM measurements as m
      INNER JOIN foods
      ON m.id = $1
        AND foods.id = $2
        AND foods.user_id = $3
      RETURNING measurements.*
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
    resolve(queryResult.result.rows[0]);
  });
}
