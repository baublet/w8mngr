import { Unauthorized } from "../helpers/errors/Unauthorized";

import {
  createPermissionService,
  requireAuth,
} from "./createPermissionService";
import { foodLogDataService } from "../dataServices/foodLog";
import { Context } from "api/createContext";

export const foodLogPermissionService = createPermissionService({
  create: requireAuth,
  delete: contextUserOwnerOfFoodLog,
});

async function contextUserOwnerOfFoodLog(
  context: Context,
  foodLogId: string
): Promise<true | Error> {
  const found = await foodLogDataService.findOneOrFail(context, foodLogId);
  if (found.userId !== context.getCurrentUserId()) {
    return new Unauthorized(context);
  }
  return true;
}
