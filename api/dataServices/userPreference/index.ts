import { getUserPreferences } from "./getUserPreferences";
import { rootService } from "./rootService";

export const userPreferenceDataService = {
  ...rootService,
  getUserPreferences,
};

export {
  UserPreferenceValues,
  userPreferenceTypes,
  UserPreferenceEntity,
} from "./types";
