import { QueryBuilderForQuery, getQueryBuilderFactory } from "../../config";
import { TokenEntity } from "./types";

export const getQuery = getQueryBuilderFactory<TokenEntity>("token");
