import { MeasurementType } from "../measurements/types";
import findMeasurementByFoodId from "../measurements/findByFoodId";
import createMeasurement from "../measurements/create";
import updateMeasurement from "../measurements/update";
import deleteMeasurement from "../measurements/delete";

export async function measurementsResolver(
  _,
  { foodIds },
  context
): Promise<Array<MeasurementType> | false> {
  const user = context.user;
  if (!user) {
    return false;
  }
  const foods = await findMeasurementByFoodId(
    user.id,
    Array.isArray(foodIds) ? foodIds : [foodIds]
  );
  return foods;
}

export async function createMeasurementResolver(
  _,
  { food_id, amount, unit, calories, fat, carbs, protein },
  context
): Promise<MeasurementType | false> {
  const user = context.user;
  if (!user) {
    return false;
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
  return newEntry;
}

export async function updateMeasurementResolver(
  _,
  { id, food_id, amount, unit, calories, fat, carbs, protein },
  context
): Promise<MeasurementType | false> {
  const user = context.user;
  if (!user) {
    return false;
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
  return updatedEntry;
}

export async function deleteMeasurementResolver(
  _,
  { id, food_id },
  context
): Promise<MeasurementType | boolean> {
  const user = context.user;
  if (!user) {
    return false;
  }
  return await deleteMeasurement(id, food_id, user.id);
}
