import { getQueryBuilderFactory } from "../../config/db";
import { ActivityMuscle } from "./types";

export const getQuery =
  getQueryBuilderFactory<ActivityMuscle>("activity_muscle");
