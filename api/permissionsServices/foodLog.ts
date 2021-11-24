import { errors } from "../helpers";

import {
  createPermissionService,
  requireAuth,
} from "./createPermissionService";
import { foodLogDataService } from "../dataServices";
import { Context } from "api/createContext";

export const foodLogPermissionService = createPermissionService({
  create: requireAuth,
  delete: contextUserOwnerOfFoodLog,
});

async function contextUserOwnerOfFoodLog(
  context: Context,
  foodLogId: string
): Promise<true | Error> {
  const found = await foodLogDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", foodLogId)
  );
  if (found.userId !== context.currentUser?.id) {
    return new errors.Unauthorized(context);
  }
  return true;
}
