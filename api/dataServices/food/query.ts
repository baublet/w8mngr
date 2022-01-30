import { getQueryBuilderFactory } from "../../config";
import { FoodEntity } from "./types";

export const getQuery = getQueryBuilderFactory<FoodEntity>("food");
