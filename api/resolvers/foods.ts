import { FoodType } from "../foods/types";
import search from "../foods/search";
import findByUserId from "../foods/findByUserId";
import createFood from "../foods/create";
import updateFood from "../foods/update";
import deleteFood from "../foods/delete";
import readFood from "../foods/read";
import findMeasurementByFoodId from "../measurements/findByFoodId";

// This is used to stop n+1 problems
async function attachMeasurementsToFoods(
  userId: number,
  foods: Array<FoodType>
): Promise<Array<FoodType>> {
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
    return sortedFoodsArray;
  }
  return foods;
}

export async function foodsResolver(
  _,
  { offset, limit },
  context
): Promise<Array<FoodType>> {
  const user = context.user;
  if (!user) {
    return [];
  }

  const foods = await findByUserId(user.id, offset, limit);
  if (!foods) {
    return foods || [];
  }

  return await attachMeasurementsToFoods(user.id, foods);
}

export async function searchFoodsResolver(
  _,
  { term },
  context
): Promise<Array<FoodType>> {
  const user = context.user;
  if (!user) {
    return [];
  }

  const foods = await search(user.id, term);
  if (!foods) {
    return foods || [];
  }

  return await attachMeasurementsToFoods(user.id, foods);
}

export async function readFoodResolver(
  _,
  { id },
  context
): Promise<FoodType | false> {
  const user = context.user;
  if (!user) {
    return false;
  }

  const food = await readFood(user.id, id);
  if (!food) {
    return food;
  }

  const measurements = await findMeasurementByFoodId(user.id, [food.id]);
  food.measurements = [];
  if (Array.isArray(measurements)) {
    measurements.forEach(measurement => {
      food.measurements.push(measurement);
    });
  }

  return food;
}

export async function createFoodResolver(
  _,
  { name, description },
  context
): Promise<FoodType | false> {
  const user = context.user;
  if (!user) {
    return false;
  }

  const newEntry = await createFood(user.id, name, description);

  // We never want to allow a food to have measurements: null
  // So we want to add an empty array here, indicating that
  // there are no measurements yet.
  newEntry.measurements = [];

  return newEntry;
}

export async function updateFoodResolver(
  _,
  { id, name, description },
  context
): Promise<FoodType | false> {
  const user = context.user;
  if (!user) {
    return false;
  }

  const food = await updateFood(id, user.id, name, description);

  const measurements = await findMeasurementByFoodId(user.id, [food.id]);
  food.measurements = [];
  if (Array.isArray(measurements)) {
    measurements.forEach(measurement => {
      food.measurements.push(measurement);
    });
  }

  return food;
}

export async function deleteFoodResolver(_, { id }, context): Promise<boolean> {
  const user = context.user;
  if (!user) {
    return false;
  }
  return await deleteFood(id, user.id);
}
