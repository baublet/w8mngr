import { createDigest } from "../../authentication/createDigest";
import { Context } from "../../createContext";
import { rootService } from "./rootService";
import { TOKEN_EXPIRY_OFFSET, TokenEntity, assertIsTokenType } from "./types";
import { assertIsTruthy } from "../../../shared";
import { getUniqueId } from "../../../shared/getUniqueId";

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
