import { ResolverType } from "../resolvers/types";

import {
  readFoodEntriesResolver,
  createFoodEntryResolver,
  updateFoodEntryResolver,
  deleteFoodEntryResolver
} from "./foodEntries";
import { login } from "./login";
import { register } from "./register";
import {
  foodsResolver,
  createFoodResolver,
  readFoodResolver,
  updateFoodResolver,
  deleteFoodResolver,
  searchFoodsResolver
} from "./foods";
import {
  createMeasurementResolver,
  updateMeasurementResolver,
  deleteMeasurementResolver,
  measurementsResolver
} from "./measurements";
import user from "./user";
import {
  readActivitiesResolver,
  readActivityResolver,
  createActivityResolver,
  updateActivityResolver,
  deleteActvityResolver,
  searchActivitiesResolver
} from "./activities";

export default {
  Query: {
    hello: () => "Hello world!",
    user: <ResolverType>user,
    foodEntries: <ResolverType>readFoodEntriesResolver,
    foods: <ResolverType>foodsResolver,
    food: <ResolverType>readFoodResolver,
    searchFoods: <ResolverType>searchFoodsResolver,
    measurements: <ResolverType>measurementsResolver,
    activity: <ResolverType>readActivityResolver,
    activities: <ResolverType>readActivitiesResolver,
    searchActivities: <ResolverType>searchActivitiesResolver
  },
  Mutation: {
    login: <ResolverType>login,
    register: <ResolverType>register,
    createFoodEntry: <ResolverType>createFoodEntryResolver,
    updateFoodEntry: <ResolverType>updateFoodEntryResolver,
    deleteFoodEntry: <ResolverType>deleteFoodEntryResolver,
    createFood: <ResolverType>createFoodResolver,
    updateFood: <ResolverType>updateFoodResolver,
    deleteFood: <ResolverType>deleteFoodResolver,
    createMeasurement: <ResolverType>createMeasurementResolver,
    updateMeasurement: <ResolverType>updateMeasurementResolver,
    deleteMeasurement: <ResolverType>deleteMeasurementResolver,
    createActivity: <ResolverType>createActivityResolver,
    updateActivity: <ResolverType>updateActivityResolver,
    deleteActivity: <ResolverType>deleteActvityResolver
  }
};
