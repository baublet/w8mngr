import { userPreferenceDataService } from "../../dataServices";
import { UserResolvers } from "../../generated";

export const usePreferences: UserResolvers["preferences"] = (
  parent,
  args,
  context
) => {
  return userPreferenceDataService.getUserPreferences(context, {
    userId: parent.id,
  });
};
