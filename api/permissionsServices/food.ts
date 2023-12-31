import {
  createPermissionService,
  requireAuth,
} from "./createPermissionService.js";

export const foodPermissionService = createPermissionService({
  listFoods: requireAuth,
  createFood: requireAuth,
  deleteFood: requireAuth,
});
