import { ActivityResolvers } from "../../generated.js";
import { activityObjectPermissionService } from "../../permissionsServices/activity.js";

export const activityPermissions: ActivityResolvers["permissions"] = (
  parent,
  args,
  context
) => {
  const permissions = context.services.get(activityObjectPermissionService);
  return permissions.materializeToPermissionsObject({
    canDelete: [parent.id],
    canEdit: [parent.id],
  });
};
