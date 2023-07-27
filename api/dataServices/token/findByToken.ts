import { createDigest } from "../../authentication/createDigest";
import { Context } from "../../createContext";
import { rootService } from "./rootService";
import { TokenEntity } from "./types";

export async function findByToken(
  context: Context,
  token: string
): Promise<TokenEntity | undefined> {
  const digest = await createDigest(token);
  return rootService.findOneBy(context, (q) =>
    q.where("tokenDigest", "=", digest)
  );
}
