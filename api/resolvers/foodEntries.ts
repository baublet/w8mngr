import { FoodEntryType } from "../foodEntries/types";
import foodEntriesByUserIdAndDays from "../foodEntries/findByUserIdAndDays";
import createFoodEntry from "../foodEntries/create";
import updateFoodEntry from "../foodEntries/update";
import deleteFoodEntry from "../foodEntries/delete";

export function readFoodEntriesResolver(
  _,
  { day },
  context
): Promise<Array<FoodEntryType> | Boolean> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve([]);
    }
    resolve((await foodEntriesByUserIdAndDays(user.id, [day])) || []);
  });
}

export function createFoodEntryResolver(
  _,
  { description, calories, fat, carbs, protein, day },
  context
): Promise<FoodEntryType | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
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
    resolve(newEntry);
  });
}

export function updateFoodEntryResolver(
  _,
  { id, description, calories, fat, carbs, protein, day },
  context
): Promise<FoodEntryType | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
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
    resolve(newEntry);
  });
}

export function deleteFoodEntryResolver(
  _,
  { id, description, calories, fat, carbs, protein, day },
  context
): Promise<boolean> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    resolve(await deleteFoodEntry(id, user.id));
  });
}
