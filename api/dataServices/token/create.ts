import { ulid } from "ulid";

import { createDigest } from "../../authentication/createDigest";
import { Context } from "../../createContext";
import { rootService, rootService as tokenDataService } from "./rootService";
import { TOKEN_EXPIRY_OFFSET, TokenEntity, assertIsTokenType } from "./types";
import { assertIsTruthy } from "../../../shared";

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
  const tokenDigest = await createDigest(token);
  const type = input.type;
  assertIsTokenType(type);
  const expires = Date.now() + TOKEN_EXPIRY_OFFSET[type];

  const results = await rootService.create(context, [
    {
      ...input,
      id,
      tokenDigest,
      expires,
    },
  ]);
  const createdToken = results[0];
  assertIsTruthy(token, "Expected token create to return a record");
  return createdToken;
}
