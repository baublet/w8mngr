import { Context } from "../../createContext";
import { rootService } from "./rootService";
import { TokenEntity } from "./types";

export async function findByToken(
  context: Context,
  token: string
): Promise<TokenEntity | undefined> {
  return rootService.findOneBy(context, (q) =>
    q.where("tokenDigest", "=", token)
  );
}
