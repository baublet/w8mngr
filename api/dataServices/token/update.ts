import { Context } from "../../createContext";
import { TokenEntity} from "./types";
import { query, TokenQueryBuilder } from "./query";

export async function update(
  context: Context,
  where: (whereQuery: TokenQueryBuilder) => Promise<void> | void,
  token: Partial<TokenEntity>
): Promise<TokenEntity> {
  const updated = await query(context, async (query) => {
    await where(query);
    query.update(token);
    return query;
  });
  return updated[0];
}
