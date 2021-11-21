import { Context } from "../../createContext";
import { errors } from "../../helpers";
import { TokenEntity } from "./types";
import { query } from "./query";
import { dbService } from "../../config";

export async function deleteExpiredTokens(
  context: Context
): Promise<TokenEntity> {
  const database = await context.services.get(dbService);
  const connection = await database.getConnection();
  const results = await query(context, async (query) => {
    query.delete().where("expires", "<", connection.fn.now());
    return query;
  });
  if (!results[0]) {
    throw new errors.NotFoundError(
      "TokenEntity.findOneOrFail: token not found"
    );
  }
  return results[0];
}
