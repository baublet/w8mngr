import { userPreferenceDataService } from "../../dataServices/userPreference";
import { UserResolvers, UserPreferenceType } from "../../generated";

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
