import { Context } from "../../createContext";
import { query } from "./query";

export async function deleteByTokenDigests(
  context: Context,
  tokenDigests: string[]
): Promise<void> {
  if (tokenDigests.length === 0) {
    return;
  }
  await query(context, async (query) => {
    query
      .delete()
      .whereIn("tokenDigest", tokenDigests)
      .andWhere("clientId", "=", context.getClientId());
    return query;
  });
}
