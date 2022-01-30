import { getQueryBuilderFactory } from "../../config";
import { Upload } from "./types";

export const getQuery = getQueryBuilderFactory<Upload>("upload");
