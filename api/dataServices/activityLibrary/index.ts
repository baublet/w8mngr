import { rootService } from "./rootService.js";
import { popular } from "./popular.js";

export const activityLibraryDataService = {
  ...rootService,
  popular,
};

export type { ActivityLibraryEntity } from "./types.js";
