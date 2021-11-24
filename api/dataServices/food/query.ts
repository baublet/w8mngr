import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { FoodEntity } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<FoodEntity>("food");
export const getQuery = getQueryBuilderFactory<FoodEntity>("food");
export type FoodQueryBuilder = QueryBuilderForQuery<typeof query>;
