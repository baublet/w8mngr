import { Context } from "../createContext";
import { activityDataService } from "../dataServices";
import { errors } from "../helpers";
import { createPermissionService } from "./createPermissionService";

export const activityObjectPermissionService = createPermissionService({
  edit: contextUserIsOwner,
  delete: contextUserIsOwner,
});

async function contextUserIsOwner(
  context: Context,
  activityId: string
): Promise<true | Error> {
  const found = await activityDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", activityId)
  );
  if (found.userId !== context.getCurrentUserId()) {
    return new errors.Unauthorized(context);
  }
  return true;
}
