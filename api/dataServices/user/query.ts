import { getQueryProvider } from "../../config";
import { UserEntity } from "./index";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<UserEntity>("user");
export type UserQueryBuilder = QueryBuilderForQuery<typeof query>;