import { getQueryBuilderFactory } from "../../config/db";
import { WeightLog } from "./types";

export const getQuery = getQueryBuilderFactory<WeightLog>("weight_log");
