import { MutationResolvers } from "../../graphql-types";
import { activityDataService } from "../../dataServices";
import { assertIsTruthy } from "../../../shared";

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
