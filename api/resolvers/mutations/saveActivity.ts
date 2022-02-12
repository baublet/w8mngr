import { assertIsTruthy } from "../../../shared";
import { activityDataService } from "../../dataServices";
import { MutationResolvers } from "../../generated";

export const saveActivity: Required<MutationResolvers>["saveActivity"] = async (
  parent,
  { input },
  context
) => {
  const userId = context.getCurrentUserId(true);

  return activityDataService.saveMutation(context, {
    input,
    userId,
  });
};
