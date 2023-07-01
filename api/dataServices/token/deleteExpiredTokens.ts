import { Context } from "../../createContext";
import { rootService } from "./rootService";

export async function deleteExpiredTokens(context: Context): Promise<void> {
  return rootService.deleteBy(context, (qb) =>
    qb.where("expires", "<", Date.now())
  );
}
