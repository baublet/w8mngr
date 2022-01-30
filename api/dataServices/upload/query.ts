import { getQueryBuilderFactory } from "../../config/db";
import { Upload } from "./types";

export const getQuery = getQueryBuilderFactory<Upload>("upload");
