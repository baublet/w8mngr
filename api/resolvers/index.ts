import { ResolverType } from "../resolvers/types";
import { getFoodEntries, addFoodEntry } from "./foodEntries";
import login from "./login";
import register from "./register";

export default {
  Query: {
    hello: () => "Hello world!",
    foodEntries: <ResolverType>getFoodEntries
  },
  Mutation: {
    login: <ResolverType>login,
    register: <ResolverType>register,
    addFoodEntry: <ResolverType>addFoodEntry
  }
};
