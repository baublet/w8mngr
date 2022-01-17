import { ulid } from "ulid";

import { Context } from "../../createContext";
import { UserAccountEntity } from "./types";
import { getQuery } from "./query";
import { userAccountDataService } from "./";

export async function create(
  context: Context,
  userAccount: Partial<UserAccountEntity> = {}
): Promise<UserAccountEntity> {
  const queryFactory = await getQuery(context);
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
  await queryFactory().insert(normalizedUserAccountData);
  return userAccountDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", id)
  );
}
