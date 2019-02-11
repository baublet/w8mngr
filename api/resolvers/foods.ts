import { FoodType } from "../foods/types";
import findByUserId from "../foods/findByUserId";
import createFood from "../foods/create";
import updateFood from "../foods/update";
import deleteFood from "../foods/delete";

export function foodsResolver(
  _,
  { id },
  context
): Promise<Array<FoodType> | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    const foods = await findByUserId(user.id);
    resolve(foods);
  });
}

export function createFoodResolver(
  _,
  { name, description },
  context
): Promise<FoodType | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    const newEntry = await createFood(user.id, name, description);
    resolve(newEntry);
  });
}

export function updateFoodResolver(
  _,
  { id, name, description },
  context
): Promise<FoodType | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    const newEntry = await updateFood(id, user.id, name, description);
    resolve(newEntry);
  });
}

export function deleteFoodResolver(_, { id }, context): Promise<boolean> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    resolve(await deleteFood(id, user.id));
  });
}
