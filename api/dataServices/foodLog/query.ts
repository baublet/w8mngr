import { getQueryBuilderFactory } from "../../config";
import { FoodLogEntity } from "./types";

export const getQuery = getQueryBuilderFactory<FoodLogEntity>("food_log");
