import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { ActivityMuscle } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<ActivityMuscle>("activity_muscle");
export const getQuery = getQueryBuilderFactory<ActivityMuscle>("activity_muscle");
export type ActivityQueryBuilder = QueryBuilderForQuery<typeof query>;
