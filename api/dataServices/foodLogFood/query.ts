import { getQueryBuilderFactory } from "../../config/db";
import { FoodLogFood } from "./types";

export const getQuery = getQueryBuilderFactory<FoodLogFood>("food_log_food");
