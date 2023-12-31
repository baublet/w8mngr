import { userPreferenceDataService } from "../../dataServices/userPreference/index.js";
import { UserResolvers, UserPreferenceType } from "../../generated.js";

export const usePreferences: UserResolvers["preferences"] = async (
  parent,
  args,
  context
) => {
  const preferences = await userPreferenceDataService.getUserPreferences(
    context,
    {
      userId: parent.id,
    }
  );

  return preferences.map((p) => ({
    ...p,
    key: p.key as UserPreferenceType,
  }));
};
