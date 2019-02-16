import { MeasurementType } from "../measurements/types";
import findMeasurementByFoodId from "../measurements/findByFoodId";
import createMeasurement from "api/measurements/create";

export function measurementsResolver(
  _,
  { foodIds },
  context
): Promise<Array<MeasurementType> | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    const foods = await findMeasurementByFoodId(
      user.id,
      Array.isArray(foodIds) ? foodIds : [foodIds]
    );
    resolve(foods);
  });
}

export function createFoodResolver(
  _,
  { foodId, userId, amount, unit, calories, fat, carbs, protein },
  context
): Promise<MeasurementType | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    const newEntry = await createMeasurement(
      foodId,
      userId,
      amount,
      unit,
      calories,
      fat,
      carbs,
      protein
    );
    resolve(newEntry);
  });
}
