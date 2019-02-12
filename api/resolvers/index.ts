import { ResolverType } from "../resolvers/types";
import user from "./user";
import {
  readFoodEntriesResolver,
  createFoodEntryResolver,
  updateFoodEntryResolver,
  deleteFoodEntryResolver
} from "./foodEntries";
import login from "./login";
import register from "./register";
import {
  foodsResolver,
  createFoodResolver,
  updateFoodResolver,
  deleteFoodResolver
} from "./foods";

export default {
  Query: {
    hello: () => "Hello world!",
    user: <ResolverType>user,
    foodEntries: <ResolverType>readFoodEntriesResolver,
    foods: <ResolverType>foodsResolver
  },
  Mutation: {
    login: <ResolverType>login,
    register: <ResolverType>register,
    createFoodEntry: <ResolverType>createFoodEntryResolver,
    updateFoodEntry: <ResolverType>updateFoodEntryResolver,
    deleteFoodEntry: <ResolverType>deleteFoodEntryResolver,
    createFood: <ResolverType>createFoodResolver,
    updateFood: <ResolverType>updateFoodResolver,
    deleteFood: <ResolverType>deleteFoodResolver
  }
};
