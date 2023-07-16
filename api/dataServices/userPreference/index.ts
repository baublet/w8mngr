import { getUserPreferences } from "./getUserPreferences";
import { rootService } from "./rootService";

export const userPreferenceDataService = {
  ...rootService,
  getUserPreferences,
};

export type { UserPreferenceValues, UserPreferenceEntity } from "./types";

export { userPreferenceTypes } from "./types";
