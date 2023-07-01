import { ulid } from "ulid";

import { createDigest } from "../../authentication/createDigest";
import { Context } from "../../createContext";
import { create } from "./create";
import { Database, dbService, InsertableDatabaseRecord } from "../../config/db";
import { rootService as tokenDataService } from "./rootService";
import { TOKEN_EXPIRY_OFFSET, assertIsTokenType } from "./types";
import { assertIsTruthy } from "../../../shared";

export async function getOrCreate(
  context: Context,
  token: Omit<
    InsertableDatabaseRecord<Database["token"]>,
    "id" | "tokenDigest" | "expires" | "clientId"
  >
): Promise<{
  entity: InsertableDatabaseRecord<Database["token"]>;
  token: string;
}> {
  const existingToken = await context.services
    .get(dbService)("W8MNGR_1")
    .selectFrom("token")
    .where("userAccountId", "=", token.userAccountId)
    .where("type", "=", token.type)
    .limit(1)
    .selectAll()
    .executeTakeFirst();

  const newToken = ulid();
  const newTokenDigest = await createDigest(newToken);
  const tokenType = token.type;
  assertIsTokenType(tokenType);

  if (existingToken) {
    // Update the old record with the new token digest
    const tokens = await tokenDataService.update(
      context,
      (q) => q.where("id", "=", existingToken.id),
      {
        tokenDigest: newTokenDigest,
        expires: Date.now() + TOKEN_EXPIRY_OFFSET[tokenType],
      }
    );
    const token = tokens[0];
    assertIsTruthy(token, "Expected token to be truthy");
    return {
      entity: token,
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
