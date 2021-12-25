import { MutationResolvers } from "../../graphql-types";
import { activityLogDataService } from "../../dataServices";
import { Unauthorized } from "../../helpers/errors/Unauthorized";
import { log } from "../../config";

export const deleteActivityLog: MutationResolvers["deleteActivityLog"] = async (
  parent,
  args,
  context
) => {
  const userId = context.currentUser?.id;

  if (!userId) {
    const error = new Unauthorized(context);
    log("error", "Unauthorized attempt to delete activity log", { error });
    return { error: [error.message] };
  }

  await activityLogDataService.deleteBy(context, (q) =>
    q.where("id", "=", args.input.id).andWhere("userId", "=", userId)
  );

  return { error: [] };
};
