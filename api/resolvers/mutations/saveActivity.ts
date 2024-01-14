import { activityDataService } from "../../dataServices/activity/index.js";
import { MutationResolvers } from "../../generated.js";

export const saveActivity: Required<MutationResolvers>["saveActivity"] = async (
  parent,
  { input },
  context,
) => {
  const userId = context.getCurrentUserId(true);

  return activityDataService.saveMutation(context, {
    input,
    userId,
  });
};
