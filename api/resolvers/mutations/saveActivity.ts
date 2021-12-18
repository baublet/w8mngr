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
  const [activityResult] = await activityDataService.upsert(
    context,
    [
      {
        ...input,
        userId,
      },
    ],
    (q) => q.where("id", "=", userId)
  );
  const activity = await activityDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", activityResult.id)
  );

  return {
    errors: [],
    activity,
  };
};
