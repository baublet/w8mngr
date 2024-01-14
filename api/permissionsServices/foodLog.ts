import { Unauthorized } from "../helpers/errors/Unauthorized.js";

import {
  createPermissionService,
  requireAuth,
} from "./createPermissionService.js";
import { foodLogDataService } from "../dataServices/foodLog/index.js";
import { Context } from "../createContext.js";

export const foodLogPermissionService = createPermissionService({
  create: requireAuth,
  delete: contextUserOwnerOfFoodLog,
});

async function contextUserOwnerOfFoodLog(
  context: Context,
  foodLogId: string,
): Promise<true | Error> {
  const found = await foodLogDataService.findOneOrFail(context, foodLogId);
  if (found.userId !== context.getCurrentUserId()) {
    return new Unauthorized(context);
  }
  return true;
}
