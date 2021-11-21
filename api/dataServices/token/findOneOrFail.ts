import { Context } from "../../createContext";
import { errors } from "../../helpers";
import { TokenEntity } from "./types";
import { query, TokenQueryBuilder } from "./query";

export async function findOneOrFail(
  context: Context,
  where: (whereQuery: TokenQueryBuilder) => Promise<void> | void
): Promise<TokenEntity> {
  const results = await query(context, async (query) => {
    query.select("*");
    await where(query);
    query.limit(1);
    return query;
  });
  if (!results[0]) {
    throw new errors.NotFoundError("TokenEntity.findOneOrFail: token not found");
  }
  return results[0];
}
