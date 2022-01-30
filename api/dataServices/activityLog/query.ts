import { getQueryBuilderFactory } from "../../config";
import { ActivityLog } from "./types";

export const getQuery = getQueryBuilderFactory<ActivityLog>("activity_log");
