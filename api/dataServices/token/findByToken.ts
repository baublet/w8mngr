import { createDigest } from "../../authentication/createDigest";
import { Context } from "../../createContext";
import { getQuery } from "./query";
import { TokenEntity } from "./types";

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
