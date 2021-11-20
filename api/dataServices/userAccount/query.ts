import { QueryBuilderForQuery } from "../../config/db";
import { getQueryProvider } from "../../config";
import { UserAccountEntity } from "./types";

export const query = getQueryProvider<UserAccountEntity>("user_account");
export type UserAccountQueryBuilder = QueryBuilderForQuery<typeof query>;