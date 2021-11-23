import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { FoodLogEntity } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<FoodLogEntity>("food_log");
export const getQuery = getQueryBuilderFactory<FoodLogEntity>("food_log");
export type FoodLogQueryBuilder = QueryBuilderForQuery<typeof query>;
