import { getQueryBuilderFactory } from "../../config/db";
import { ActivityLog } from "./types";

export const getQuery = getQueryBuilderFactory<ActivityLog>("activity_log");
