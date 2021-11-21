import { getQueryProvider } from "../../config";
import { TokenEntity } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<TokenEntity>("token");
export type TokenQueryBuilder = QueryBuilderForQuery<typeof query>;
