import { Context } from "../../createContext";
import { getQuery } from "./query";

export async function deleteExpiredTokens(context: Context): Promise<void> {
  const queryFactory = await getQuery(context);
  await queryFactory().delete().where("expires", "<", new Date().toISOString());
}
