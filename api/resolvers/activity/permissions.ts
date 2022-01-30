import { ActivityResolvers } from "../../graphql-types";
import { activityObjectPermissionService } from "../../permissionsServices";

export const activityPermissions: ActivityResolvers["permissions"] = (
  parent,
  args,
  context
) => {
  return activityObjectPermissionService.materializeToPermissionsObject({
    delete: [context, parent.id],
    edit: [context, parent.id],
  });
};
