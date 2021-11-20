import { ulid } from "ulid";

import { Context } from "../../createContext";
import { UserAccountEntity } from "./types";
import { query } from "./query";

export async function create(
  context: Context,
  userAccount: Partial<UserAccountEntity> = {}
): Promise<UserAccountEntity> {
  const id = ulid();
  const normalizedUserAccountData: Pick<
    UserAccountEntity,
    "id" | "source" | "userId"
  > = {
    id,
    source: "local" as const,
    userId: "temporary",
    ...userAccount,
  };
  await query(context, (query) => query.insert(normalizedUserAccountData));

  const found = await query(context, (query) => {
    query.select("*").where("id", "=", id);
    return query;
  });
  return found[0];
}
