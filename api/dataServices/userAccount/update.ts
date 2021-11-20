import { Context } from "../../createContext";
import { UserAccountEntity } from "./types";
import { query, UserAccountQueryBuilder } from "./query";

export async function update(
  context: Context,
  where: (whereQuery: UserAccountQueryBuilder) => Promise<void> | void,
  userAccount: Partial<UserAccountEntity>
): Promise<UserAccountEntity> {
  const updated = await query(context, async (query) => {
    await where(query);
    query.insert(userAccount);
  });
  return updated[0];
}
