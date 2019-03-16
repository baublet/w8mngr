import { FoodEntryType } from "../foodEntries/types";
import foodEntriesByUserIdAndDays from "../foodEntries/findByUserIdAndDays";
import createFoodEntry from "../foodEntries/create";
import updateFoodEntry from "../foodEntries/update";
import deleteFoodEntry from "../foodEntries/delete";

export async function readFoodEntriesResolver(
  _,
  { day },
  context
): Promise<Array<FoodEntryType> | Boolean> {
  const user = context.user;
  if (!user) {
    return [];
  }
  return (await foodEntriesByUserIdAndDays(user.id, [day])) || [];
}

export async function createFoodEntryResolver(
  _,
  { description, calories, fat, carbs, protein, day },
  context
): Promise<FoodEntryType | false> {
  const user = context.user;
  if (!user) {
    return false;
  }
  const newEntry = await createFoodEntry(
    user.id,
    day,
    description,
    calories,
    fat,
    carbs,
    protein
  );
  return newEntry;
}

export async function updateFoodEntryResolver(
  _,
  { id, description, calories, fat, carbs, protein },
  context
): Promise<FoodEntryType | false> {
  const user = context.user;
  if (!user) {
    return false;
  }
  const newEntry = await updateFoodEntry(
    id,
    user.id,
    description,
    calories,
    fat,
    carbs,
    protein
  );
  return newEntry;
}

export async function deleteFoodEntryResolver(
  _,
  { id },
  context
): Promise<boolean> {
  const user = context.user;
  if (!user) {
    return false;
  }
  return await deleteFoodEntry(id, user.id);
}
