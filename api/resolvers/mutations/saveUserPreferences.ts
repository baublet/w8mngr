import { log } from "../../config/log";
import { userPreferenceDataService } from "../../dataServices";
import { MutationResolvers } from "../../generated";

export const saveUserPreferences: MutationResolvers["saveUserPreferences"] =
  async (parent, { input }, context) => {
    const userId = context.getCurrentUserId(true);

    const result = await userPreferenceDataService.upsertBy({
      context,
      items: input.preferences.map((input) => ({
        preference: input.key,
        value: JSON.stringify(input.value),
        userId,
      })),
      columns: ["preference", "userId"],
    });

    if (result instanceof Error) {
      log("error", "Error saving user preferences", { error: result });
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
