import { getQueryBuilderFactory } from "../../config";
import { FoodLogFood } from "./types";

export const getQuery = getQueryBuilderFactory<FoodLogFood>("food_log_food");
