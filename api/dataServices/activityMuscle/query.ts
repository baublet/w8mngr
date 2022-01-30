import { getQueryBuilderFactory } from "../../config";
import { ActivityMuscle } from "./types";

export const getQuery =
  getQueryBuilderFactory<ActivityMuscle>("activity_muscle");
