import { ActivityResolvers } from "../../generated";
import { activityObjectPermissionService } from "../../permissionsServices";

export const activityPermissions: ActivityResolvers["permissions"] = (
  parent,
  args,
  context
) => {
  const permissions = context.services.get(activityObjectPermissionService);
  return permissions.materializeToPermissionsObject({
    delete: [parent.id],
    edit: [parent.id],
  });
};
