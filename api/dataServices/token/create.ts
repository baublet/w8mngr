import { createDigest } from "../../authentication/createDigest.js";
import { Context } from "../../createContext.js";
import { rootService } from "./rootService.js";
import { TOKEN_EXPIRY_OFFSET, TokenEntity, assertIsTokenType } from "./types.js";
import { assertIsTruthy } from "../../../shared/assertIsTruthy.js";
import { getUniqueId } from "../../../shared/getUniqueId.js";

export async function create(
  context: Context,
  {
    token,
    ...input
  }: Omit<TokenEntity, "id" | "tokenDigest" | "expires"> & {
    token: string;
  }
): Promise<TokenEntity> {
  const id = getUniqueId();
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
