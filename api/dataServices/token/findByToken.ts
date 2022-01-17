import { Context } from "../../createContext";
import { TokenEntity } from "./types";
import { getQuery } from "./query";
import { createDigest } from "../../authentication";

export async function findByToken(
  context: Context,
  token: string
): Promise<TokenEntity | undefined> {
  const tokenDigest = createDigest(token);
  const queryFactory = await getQuery(context);
  const results = await queryFactory()
    .select("*")
    .where("tokenDigest", "=", tokenDigest)
    .andWhere("clientId", "=", context.getClientId())
    .limit(1);
  return results[0];
}
