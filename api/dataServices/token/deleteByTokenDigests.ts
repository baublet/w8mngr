import { Context } from "../../createContext";
import { getQuery } from "./query";

export async function deleteByTokenDigests(
  context: Context,
  tokenDigests: string[]
): Promise<void> {
  if (tokenDigests.length === 0) {
    return;
  }
  const queryFactory = await getQuery(context);
  await queryFactory()
    .delete()
    .whereIn("tokenDigest", tokenDigests)
    .andWhere("clientId", "=", context.getClientId());
}
