import { ulid } from "ulid";

import { createDigest } from "../../authentication/createDigest";
import { Context } from "../../createContext";
import { getQuery } from "./query";
import { rootService as tokenDataService } from "./rootService";
import { TOKEN_EXPIRY_OFFSET, TokenEntity } from "./types";

export async function create(
  context: Context,
  {
    token,
    ...input
  }: Omit<TokenEntity, "id" | "tokenDigest" | "expires"> & {
    token: string;
  }
): Promise<TokenEntity> {
  const id = ulid();
  const tokenDigest = createDigest(token);
  const expires = new Date(Date.now() + TOKEN_EXPIRY_OFFSET[input.type]);
  const queryFactory = await getQuery(context);
  const query = queryFactory();
  await query.insert({
    ...input,
    id,
    tokenDigest,
    expires,
  });
  return tokenDataService.findOneOrFail(context, (q) => q.where("id", "=", id));
}
