import { getQueryBuilderFactory } from "../../config/db";
import { FoodLogEntity } from "./types";

export const getQuery = getQueryBuilderFactory<FoodLogEntity>("food_log");
