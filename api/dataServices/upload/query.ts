import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { Upload } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<Upload>("upload");
export const getQuery = getQueryBuilderFactory<Upload>("upload");
export type UploadQueryBuilder = QueryBuilderForQuery<typeof query>;
