import { ulid } from "ulid";

import { createDigest } from "../../authentication/createDigest";
import { Context } from "../../createContext";
import { create } from "./create";
import { getQuery } from "./query";
import { rootService as tokenDataService } from "./rootService";
import { TOKEN_EXPIRY_OFFSET, TokenEntity } from "./types";

export async function getOrCreate(
  context: Context,
  token: Omit<TokenEntity, "id" | "tokenDigest" | "expires" | "clientId">
): Promise<{ entity: TokenEntity; token: string }> {
  const queryFactory = await getQuery(context);

  const existing = await queryFactory()
    .select("*")
    .where("clientId", "=", context.getClientId())
    .andWhere("userAccountId", "=", token.userAccountId)
    .andWhere("type", "=", token.type)
    .limit(1);

  const newToken = ulid();
  const newTokenDigest = createDigest(newToken);
  const existingToken = existing[0];

  if (existingToken) {
    // Update the old record with the new token digest
    await tokenDataService.update(
      context,
      (q) => q.where("id", "=", existingToken.id),
      {
        tokenDigest: newTokenDigest,
        expires: new Date(Date.now() + TOKEN_EXPIRY_OFFSET[token.type]),
      }
    );
    return {
      entity: await tokenDataService.findOneOrFail(context, (q) =>
        q.where("id", "=", existingToken.id)
      ),
      token: newToken,
    };
  }

  const createdToken = await create(context, {
    clientId: context.getClientId(),
    token: newToken,
    type: token.type,
    userAccountId: token.userAccountId,
  });

  return {
    entity: createdToken,
    token: newToken,
  };
}
