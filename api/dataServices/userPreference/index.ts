import { getUserPreferences } from "./getUserPreferences.js";
import { rootService } from "./rootService.js";

export const userPreferenceDataService = {
  ...rootService,
  getUserPreferences,
};

export type { UserPreferenceValues, UserPreferenceEntity } from "./types.js";

export { userPreferenceTypes } from "./types.js";
