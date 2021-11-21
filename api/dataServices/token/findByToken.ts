import { Context } from "../../createContext";
import { TokenEntity } from "./types";
import { query } from "./query";
import { createDigest } from "../../authentication";

export async function findByToken(
  context: Context,
  token: string
): Promise<TokenEntity | undefined> {
  const tokenDigest = createDigest(token);
  const results = await query(context, async (query) => {
    query
      .select("*")
      .where("tokenDigest", "=", tokenDigest)
      .andWhere("clientId", "=", context.getClientId())
      .limit(1);
    return query;
  });
  return results[0];
}
