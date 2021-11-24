import {
  createPermissionService,
  requireAuth,
} from "./createPermissionService";

export const foodPermissionService = createPermissionService({
  listFoods: requireAuth,
  createFood: requireAuth,
  deleteFood: requireAuth,
});
