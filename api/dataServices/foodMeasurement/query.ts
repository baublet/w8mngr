import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { FoodMeasurement } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<FoodMeasurement>("food_measurement");
export const getQuery = getQueryBuilderFactory<FoodMeasurement>("food_measurement");
export type FoodMeasurementQueryBuilder = QueryBuilderForQuery<typeof query>;
