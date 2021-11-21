import { ulid } from "ulid";

import { Context } from "../../createContext";
import { TokenEntity } from "./types";
import { query } from "./query";
import { createDigest } from "../../authentication";
import { dbService } from "../../config";
import { create } from "./create";
import { update } from "./update";

export async function getOrCreate(
  context: Context,
  token: Omit<TokenEntity, "id" | "tokenDigest" | "expires" | "clientId">
): Promise<{ entity: TokenEntity; token: string }> {
  const database = await context.services.get(dbService);
  const connection = await database.getConnection();
  const existing = await query(context, (q) => {
    q.select("*")
      .where("clientId", "=", context.getClientId())
      .andWhere("userAccountId", "=", token.userAccountId)
      .andWhere("type", "=", token.type)
      .andWhere("expires", ">=", connection.fn.now())
      .limit(1);
    return q;
  });

  const newToken = ulid();
  const newTokenDigest = createDigest(newToken);
  const existingToken = existing[0];

  if (existingToken) {
    // Update the old record with the new token digest
    const updatedToken = await update(
      context,
      (q) => q.where("id", "=", existingToken.id),
      {
        tokenDigest: newTokenDigest,
      }
    );
    return { entity: updatedToken, token: newToken };
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
