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

export default {
  Query: {
    hello: () => "Hello world!",
    user: <ResolverType>user,
    foodEntries: <ResolverType>readFoodEntriesResolver
  },
  Mutation: {
    login: <ResolverType>login,
    register: <ResolverType>register,
    createFoodEntry: <ResolverType>createFoodEntryResolver,
    updateFoodEntry: <ResolverType>updateFoodEntryResolver,
    deleteFoodEntry: <ResolverType>deleteFoodEntryResolver
  }
};
