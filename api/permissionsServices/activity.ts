import { Context } from "../createContext";
import { activityDataService } from "../dataServices/activity";
import { Unauthorized } from "../helpers/errors/Unauthorized";
import { createPermissionService } from "./createPermissionService";

export const activityObjectPermissionService = createPermissionService({
  edit: contextUserIsOwner,
  delete: contextUserIsOwner,
});

async function contextUserIsOwner(
  context: Context,
  activityId: string
): Promise<true | Error> {
  const found = await activityDataService.findOneOrFail(context, activityId);
  if (found.userId !== context.getCurrentUserId()) {
    return new Unauthorized(context);
  }
  return true;
}
