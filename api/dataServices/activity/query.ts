import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { Activity } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<Activity>("activity");
export const getQuery = getQueryBuilderFactory<Activity>("activity");
export type ActivityQueryBuilder = QueryBuilderForQuery<typeof query>;
