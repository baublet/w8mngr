import { MutationResolvers } from "../../graphql-types";
import { activityDataService } from "../../dataServices";
import { assertIsTruthy } from "../../../shared";

export const saveActivity: Required<MutationResolvers>["saveActivity"] = async (
  parent,
  { input },
  context
) => {
  const userId = context.currentUser?.id;
  assertIsTruthy(userId);

  return activityDataService.saveMutation(context, {
    input,
    userId,
  });
};
