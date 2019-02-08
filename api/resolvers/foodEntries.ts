import { FoodEntryType } from "../foodEntries/types";
import foodEntriesByUserIdAndDays from "../foodEntries/findByUserIdAndDays";
import createFoodEntry from "../foodEntries/create";

export function getFoodEntries(
  _,
  { days },
  context
): Promise<Array<FoodEntryType> | Boolean> {
  return new Promise(async resolve => {
    const user = context.user;
    console.log(user);
    if (!user) {
      return resolve([]);
    }
    resolve((await foodEntriesByUserIdAndDays(user.id, days)) || []);
  });
}

export function addFoodEntry(
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
    console.log(newEntry);
    resolve(newEntry);
  });
}
