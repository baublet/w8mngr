import { Context } from "../../createContext.js";
import { rootService } from "./rootService.js";

export async function deleteExpiredTokens(context: Context): Promise<void> {
  return rootService.deleteBy(context, (qb) =>
    qb.where("expires", "<", Date.now()),
  );
}
