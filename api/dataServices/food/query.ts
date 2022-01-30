import { getQueryBuilderFactory } from "../../config/db";
import { FoodEntity } from "./types";

export const getQuery = getQueryBuilderFactory<FoodEntity>("food");
