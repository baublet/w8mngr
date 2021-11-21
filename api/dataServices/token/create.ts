import { ulid } from "ulid";

import { Context } from "../../createContext";
import { TokenEntity, TOKEN_EXPIRY_OFFSET } from "./types";
import { query } from "./query";
import { findOneOrFail } from "./findOneOrFail";
import { createDigest } from "../../authentication";

export async function create(
  context: Context,
  { token, ...input}: Omit<TokenEntity, "id" | "tokenDigest" | "expires"> & {
    token: string;
  }
): Promise<TokenEntity> {
  const id = ulid();
  const tokenDigest = createDigest(token);
  const expires = new Date(Date.now() + TOKEN_EXPIRY_OFFSET[input.type]);
  await query(context, (query) => {
    query.insert({
      ...input,
      id,
      tokenDigest,
      expires,
    });
    return query;
  });
  return findOneOrFail(context, (q) => q.where("id", "=", id));
}
