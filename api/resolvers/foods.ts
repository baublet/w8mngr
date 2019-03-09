import { FoodType } from "../foods/types";
import search from "../foods/search";
import findByUserId from "../foods/findByUserId";
import createFood from "../foods/create";
import updateFood from "../foods/update";
import deleteFood from "../foods/delete";
import readFood from "../foods/read";
import findMeasurementByFoodId from "../measurements/findByFoodId";

// This is used to stop n+1 problems
function attachMeasurementsToFoods(
  userId: number,
  foods: Array<FoodType>
): Promise<Array<FoodType>> {
  return new Promise(async resolve => {
    Object.keys(foods).forEach(food => {
      foods[food].measurements = [];
    });
    const foodIds = !Array.isArray(foods) ? [] : foods.map(food => food.id),
      measurements = await findMeasurementByFoodId(userId, foodIds);
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
    resolve(foods);
  });
}

export function foodsResolver(_, __, context): Promise<Array<FoodType>> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve([]);
    }

    const foods = await findByUserId(user.id);
    if (!foods) {
      return resolve(foods || []);
    }

    resolve(await attachMeasurementsToFoods(user.id, foods));
  });
}

export function searchFoodsResolver(
  _,
  { term },
  context
): Promise<Array<FoodType>> {
  return new Promise(async resolve => {
    const user = context.user;
    if (!user) {
      return resolve([]);
    }

    const foods = await search(user.id, term);
    if (!foods) {
      return resolve(foods || []);
    }

    resolve(await attachMeasurementsToFoods(user.id, foods));
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
    if (!food) {
      return resolve(food);
    }

    const measurements = await findMeasurementByFoodId(user.id, [food.id]);
    food.measurements = [];
    if (Array.isArray(measurements)) {
      measurements.forEach(measurement => {
        food.measurements.push(measurement);
      });
    }

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

    // We never want to allow a food to have measurements: null
    // So we want to add an empty array here, indicating that
    // there are no measurements yet.
    newEntry.measurements = [];

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

    const food = await updateFood(id, user.id, name, description);

    const measurements = await findMeasurementByFoodId(user.id, [food.id]);
    food.measurements = [];
    if (Array.isArray(measurements)) {
      measurements.forEach(measurement => {
        food.measurements.push(measurement);
      });
    }

    resolve(food);
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
