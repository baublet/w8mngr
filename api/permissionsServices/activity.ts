import { Context } from "../createContext.js";
import { activityDataService } from "../dataServices/activity/index.js";
import { Unauthorized } from "../helpers/errors/Unauthorized.js";
import { createPermissionService } from "./createPermissionService.js";

export const activityObjectPermissionService = createPermissionService({
  canEdit: contextUserIsOwner,
  canDelete: contextUserIsOwner,
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
