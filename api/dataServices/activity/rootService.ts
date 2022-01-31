import { createDataService } from "../createDataService";
import { getQuery } from "./query";

export const rootService = createDataService(getQuery, "Activity");
