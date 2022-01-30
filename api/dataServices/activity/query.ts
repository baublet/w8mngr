import { getQueryBuilderFactory } from "../../config";
import { Activity } from "./types";

export const getQuery = getQueryBuilderFactory<Activity>("activity");
