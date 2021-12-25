import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { ActivityLog } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<ActivityLog>("activity_log");
export const getQuery = getQueryBuilderFactory<ActivityLog>("activity_log");
export type ActivityQueryBuilder = QueryBuilderForQuery<typeof query>;
