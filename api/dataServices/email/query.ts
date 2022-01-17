import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { EmailEntity } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<EmailEntity>("email");
export const getQuery = getQueryBuilderFactory<EmailEntity>("email");
export type EmailQueryBuilder = QueryBuilderForQuery<typeof query>;
