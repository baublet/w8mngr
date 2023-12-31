import { Context } from "../../createContext.js";
import { rootService } from "./rootService.js";

export async function deleteByTokenDigests(
  context: Context,
  tokenDigests: string[]
): Promise<void> {
  if (tokenDigests.length === 0) {
    return;
  }

  return rootService.deleteBy(context, (qb) =>
    qb.where("tokenDigest", "in", tokenDigests)
  );
}
