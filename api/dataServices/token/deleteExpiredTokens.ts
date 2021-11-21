import { Context } from "../../createContext";
import { errors } from "../../helpers";
import { TokenEntity } from "./types";
import { query } from "./query";
import { dbService } from "../../config";

export async function deleteExpiredTokens(context: Context): Promise<void> {
  const database = await context.services.get(dbService);
  const connection = await database.getConnection();
  await query(context, async (query) => {
    query.delete().where("expires", "<", connection.fn.now());
    return query;
  });
}
