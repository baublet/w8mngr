import { getUserPreferences } from "./getUserPreferences";
import { rootService } from "./rootService";

export const userPreferenceDataService = {
  ...rootService,
  getUserPreferences,
};

export {
  UserPreferenceEntity,
  UserPreferenceValues,
  userPreferenceTypes,
} from "./types";
