import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { UserEntity } from "./index";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<UserEntity>("user");
export const getQuery = getQueryBuilderFactory<UserEntity>("user");
export type UserQueryBuilder = QueryBuilderForQuery<typeof query>;