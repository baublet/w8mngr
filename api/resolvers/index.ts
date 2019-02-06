import { ResolverType } from "../resolvers/types";
import { getFoodEntries, addFoodEntry } from "./foodEntries";

export default {
  Query: {
    hello: () => "Hello world!",
    foodEntries: <ResolverType>getFoodEntries
  },
  Mutation: {
    addFoodEntry: <ResolverType>addFoodEntry
  }
};
