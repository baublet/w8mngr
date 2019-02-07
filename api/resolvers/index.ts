import { ResolverType } from "../resolvers/types";
import user from "./user";
import { getFoodEntries, addFoodEntry } from "./foodEntries";
import login from "./login";
import register from "./register";

export default {
  Query: {
    hello: () => "Hello world!",
    user: <ResolverType>user,
    foodEntries: <ResolverType>getFoodEntries
  },
  Mutation: {
    login: <ResolverType>login,
    register: <ResolverType>register,
    addFoodEntry: <ResolverType>addFoodEntry
  }
};
