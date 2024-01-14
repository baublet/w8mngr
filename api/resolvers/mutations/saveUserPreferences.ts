import { log } from "../../config/log.js";
import { userPreferenceDataService } from "../../dataServices/userPreference/index.js";
import { MutationResolvers } from "../../generated.js";

export const saveUserPreferences: MutationResolvers["saveUserPreferences"] =
  async (parent, { input }, context) => {
    const userId = context.getCurrentUserId(true);

    const result = await userPreferenceDataService.upsertBy(
      context,
      input.preferences.map((input) => ({
        preference: input.key,
        value: JSON.stringify(input.value),
        userId,
      })),
      ["preference", "userId"],
    );

    if (result instanceof Error) {
      log(context, "error", "Error saving user preferences", { error: result });
      return {
        errors: [result.message],
        user: { id: userId },
      };
    }

    return {
      errors: [],
      user: { id: userId },
    };
  };
