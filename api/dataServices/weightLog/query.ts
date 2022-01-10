import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { WeightLog } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<WeightLog>("weight_log");
export const getQuery = getQueryBuilderFactory<WeightLog>("weight_log");
export type ActivityQueryBuilder = QueryBuilderForQuery<typeof query>;
