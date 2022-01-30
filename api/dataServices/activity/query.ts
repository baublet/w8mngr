import { getQueryBuilderFactory } from "../../config/db";
import { Activity } from "./types";

export const getQuery = getQueryBuilderFactory<Activity>("activity");
