import { Context } from "../../createContext";
import { UserAccountEntity } from "./types";
import { query } from "./query";

export async function create(
  context: Context,
  userAccount: Partial<UserAccountEntity>
): Promise<UserAccountEntity> {
  const inserted = await query(context, (query) => query.insert(userAccount));
  return inserted[0];
}
