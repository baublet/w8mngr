import { createDigest } from "../../authentication/createDigest.js";
import { Context } from "../../createContext.js";
import { rootService } from "./rootService.js";
import { TokenEntity } from "./types.js";

export async function findByToken(
  context: Context,
  token: string,
): Promise<TokenEntity | undefined> {
  const digest = await createDigest(token);
  return rootService.findOneBy(context, (q) =>
    q.where("tokenDigest", "=", digest),
  );
}
