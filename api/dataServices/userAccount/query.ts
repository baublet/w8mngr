import { QueryBuilderForQuery } from "../../config/db";
import { getQueryBuilderFactory, getQueryProvider } from "../../config";
import { UserAccountEntity } from "./types";

export const query = getQueryProvider<UserAccountEntity>("user_account");
export const getQuery = getQueryBuilderFactory<UserAccountEntity>("user_account");
export type UserAccountQueryBuilder = QueryBuilderForQuery<typeof query>;