import { getQueryBuilderFactory } from "../../config/db";
import { TokenEntity } from "./types";

export const getQuery = getQueryBuilderFactory<TokenEntity>("token");
