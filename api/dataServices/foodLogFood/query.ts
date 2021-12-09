import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { FoodLogFood } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<FoodLogFood>("food_log_food");
export const getQuery = getQueryBuilderFactory<FoodLogFood>("food_log_food");
export type FoodLogFoodQueryBuilder = QueryBuilderForQuery<typeof query>;
