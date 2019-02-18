import { MeasurementType } from "../measurements/types";
import findMeasurementByFoodId from "../measurements/findByFoodId";
import createMeasurement from "../measurements/create";
import updateMeasurement from "../measurements/update";
import deleteMeasurement from "../measurements/delete";

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

export function createMeasurementResolver(
  _,
  { food_id, amount, unit, calories, fat, carbs, protein },
  context
): Promise<MeasurementType | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    const newEntry = await createMeasurement(
      food_id,
      user.id,
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

export function updateMeasurementResolver(
  _,
  { id, food_id, amount, unit, calories, fat, carbs, protein },
  context
): Promise<MeasurementType | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    const updatedEntry = await updateMeasurement(
      id,
      food_id,
      user.id,
      amount,
      unit,
      calories,
      fat,
      carbs,
      protein
    );
    resolve(updatedEntry);
  });
}

export function deleteMeasurementResolver(
  _,
  { id, food_id },
  context
): Promise<MeasurementType | boolean> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    resolve(await deleteMeasurement(id, food_id, user.id));
  });
}
