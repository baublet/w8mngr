import { getQueryBuilderFactory } from "../../config";
import { WeightLog } from "./types";

export const getQuery = getQueryBuilderFactory<WeightLog>("weight_log");
