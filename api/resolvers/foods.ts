import { FoodType } from "../foods/types";
import search from "../foods/search";
import findByUserId from "../foods/findByUserId";
import createFood from "../foods/create";
import updateFood from "../foods/update";
import deleteFood from "../foods/delete";
import readFood from "../foods/read";
import findMeasurementByFoodId from "../measurements/findByFoodId";

export function foodsResolver(
  _,
  __,
  context
): Promise<Array<FoodType> | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    const foods = await findByUserId(user.id),
      foodIds = !Array.isArray(foods) ? [] : foods.map(food => food.id);

    if (!foods) {
      return resolve(foods);
    }

    if (foodIds.length) {
      // Attach measurements to foods
      const measurements = await findMeasurementByFoodId(user.id, foodIds);
      if (Array.isArray(measurements)) {
        const sortedFoods = {};
        foods.forEach(food => {
          food.measurements = [];
          sortedFoods[food.id] = food;
        });
        measurements.forEach(measurement => {
          sortedFoods[measurement.food_id].measurements.push(measurement);
        });
        const sortedFoodsArray = [];
        Object.keys(sortedFoods).forEach(food =>
          sortedFoodsArray.push(sortedFoods[food])
        );
        return resolve(sortedFoodsArray);
      }
    }

    resolve(foods);
  });
}

export function searchFoodsResolver(
  _,
  { term },
  context
): Promise<Array<FoodType> | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    const foods = await search(user.id, term);
    resolve(foods);
  });
}

export function readFoodResolver(
  _,
  { id },
  context
): Promise<FoodType | false> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve(false);
    }
    const food = await readFood(user.id, id);
    resolve(food);
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
